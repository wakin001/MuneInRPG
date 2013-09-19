#pragma strict
@script RequireComponent(CharacterController)

//public var idleAnimation : AnimationClip;
//public var walkAnimation : AnimationClip;
//public var runAnimation : AnimationClip;
//public var jumpPoseAnimation : AnimationClip;
//public var jumpDownAnimation : AnimationClip;

public var jumpAnimationSpeed : float = 4;
public var fallAnimationSpeed : float = 0.1;
public var walkAnimationSpeed : float = 1.5;
public var idleAnimationSpeed : float = 0.1;
public var runAnimationSpeed : float = 2.0;

public var speed:float = 2;
public var runSpeed:float = 5.0;
public var jumpSpeed:float = 8.0;
public var gravity:float = 20.0;

private var controller:CharacterController;

// move params.
private var f_verticalSpeed:float = 0.0;
private var f_moveSpeed:float = 0.0;
private var v3_moveDirection:Vector3 = Vector3.zero;

// boolean params.
private var b_isRun:boolean;
private var b_isBackward:boolean;
private var b_isJumping:boolean;

// rotate params.
private var q_currentRotation:Quaternion; // current rotation of the character.
private var q_rot:Quaternion; //Rotate to left or right direction.
private var f_rotateSpeed:float = 1.0; // Smooth speed of rotation.


// direction params.
private var v3_forward:Vector3;
private var v3_right:Vector3;
private var c_collisionFlags:CollisionFlags; //CollisionFlag return from moving the character

// create in air time
private var f_inAirTime:float = 0.0;
private var f_inAirStartTime:float = 0.0;
private var f_minAirTime:float = 0.15; //sec

private var _animator : Animator;

function Awake():void
{
	controller = GetComponent(CharacterController);
	b_isRun = false;
	b_isBackward = false;
	b_isJumping = false;
	
	f_moveSpeed = speed;
	c_collisionFlags = CollisionFlags.Below;
	
	// set warpMode for each animation clip
	_animator = GetComponent(Animator);
}

function Start () 
{
	f_inAirStartTime = Time.time;	
}

function Update () 
{
	// get main camera transform.
	var cameraTransform = Camera.main.transform;
	
	// get forward direction of the character.
	
	//Transforms direction from local space to world space.
	//This operation is not affected by scale or position of the transform. The returned vector has the same length as direction.
	v3_forward = cameraTransform.TransformDirection(Vector3.forward);
	// Make sure that vertical direction equals zero.
	v3_forward.y = 0;
	// Right vector lelative to the character always orthogonal to the forward direction vector.
	v3_right = new Vector3(v3_forward.z, 0, -v3_forward.x); // -90 degree to the left from the forward direction.
	
	// Get horizontal move
	/**
	*Returns the value of the virtual axis identified by axisName.
	 The value will be in the range -1...1 for keyboard and joystick input. If the axis is setup to be 
	 delta mouse movement, the mouse delta is multiplied by the axis sensitivity and the range is not 
	 -1...1.
	*/
	var f_hor :float = Input.GetAxis("Horizontal");
	var f_ver : float = Input.GetAxis("Vertical");  // z-axis
	if (f_ver < 0)
	{
		b_isBackward = true;
	}
	else
	{
		b_isBackward = false;
	}
	// target direction.
	var v3_targetDirection:Vector3 = (f_hor * v3_right) + (f_ver * v3_forward);
	if (v3_targetDirection != Vector3.zero)
	{
		// Rotate toward the target direction.
		// Interpolates between from and to by the fraction t. This is most commonly used to find a point some 
		// fraction of the way along a line between two endpoints (eg, to move an object gradually between those points).
		v3_moveDirection = Vector3.Slerp(v3_moveDirection, v3_targetDirection, f_rotateSpeed * Time.deltaTime);
		v3_moveDirection = v3_moveDirection.normalized;
	}
	else
	{
		v3_moveDirection = Vector3.zero;
	}
	
	// Checking if character is on the ground
	if (!b_isJumping)
	{
		//Holding shift to run
		if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift))
		{
			b_isRun = true;
			f_moveSpeed = runSpeed;
		}
		else
		{
			b_isRun = false;
			f_moveSpeed = speed;
		}
		// press space to jump.
//		if (Input.GetKey(KeyCode.Space))
		if (Input.GetButton("Jump"))
		{
			f_verticalSpeed = jumpSpeed;
			b_isJumping = true;
		}
	}
	// Apply Gravity
	if (IsGrounded())
	{
		f_verticalSpeed = 0.0;
		b_isJumping = false;
		f_inAirTime = 0.0;
		f_inAirStartTime = Time.time;
	}
	else
	{
		f_verticalSpeed -= gravity * Time.deltaTime;
		//count time
		f_inAirTime = Time.time - f_inAirStartTime;
	}
	// Calculate actual motion.
	var v3_movement : Vector3 = (v3_moveDirection * f_moveSpeed) + Vector3(0, f_verticalSpeed, 0);
	v3_movement *= Time.deltaTime;
	// move the controller.
	// A more complex move function taking absolute movement deltas.
	// Attempts to move the controller by motion, the motion will only be constrained by collisions. 
	// It will slide along colliders. CollisionFlags is the summary of collisions that occurred 
	// during the Move. This function does not apply any gravity.
	c_collisionFlags = controller.Move(v3_movement);
	
	// play animation
	if (b_isJumping)
	{
		if (controller.velocity.y > 0)
		{
			_animator.SetBool("isJump", true);
		}
		else
		{
			_animator.SetBool("isJump", false);
			_animator.SetBool("isFall", true);
		}
	}
	else
	{
		if (IsAir()) //fall down
		{
			_animator.SetBool("isJump", false);
			_animator.SetBool("isFall", true);
		}
		else // not fall down
		{
			// if the character has no velocity or very close to 0 show idle animation.
			if (controller.velocity.sqrMagnitude < 0.1)
			{
				_animator.SetFloat("speed", idleAnimationSpeed);
			}
			else // checking if the character walks or runs
			{
				if (b_isRun)
				{
					_animator.SetFloat("speed", runAnimationSpeed);
				}
				else
				{
					_animator.SetFloat("speed", walkAnimationSpeed);
				}
			}
		}
	}
	
	
	// update rotation of the character.
	if (v3_moveDirection != Vector3.zero)
	{
		/**
		* Quaternion are based on complex numbers and are not easy to understand intuitively.
		 You almost never access or modify individual Quaternion components (x,y,z,w); 
		 most often you would just take existing rotations (e.g. from the Transform) and 
		 use them to construct new rotations (e.g. to smoothly interpolate between two rotations). 
		 The Quaternion functions that you use 99% of the time are: Quaternion.LookRotation, 
		 Quaternion.Angle, Quaternion.Euler, Quaternion.Slerp, Quaternion.FromToRotation, 
		 and Quaternion.identity.
		*/
		transform.rotation = Quaternion.LookRotation(v3_moveDirection);
	}
}


public function IsGrounded():boolean
{
	return (c_collisionFlags & CollisionFlags.Below);
}

public function IsJumping():boolean
{
	return b_isJumping;
}

public function IsAir():boolean
{
	return (f_inAirTime > f_minAirTime);
}

public function IsMoveBackward():boolean
{
	return b_isBackward;
}
