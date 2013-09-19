// Character movement speed.
public var runSpeed : int = 12;
public var walkSpeed : int = 2;
public var int_moveSpeed : int;

// Animation Params.
public var player : GameObject;
private var _animator : Animator;
//public var _animation : Animation;
public var idleAnimation : AnimationClip;
public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;
public var shotAnimation : AnimationClip;
public var walkAnimationSpeed : float = 1.5;
public var idleAnimationSpeed : float = 1.0;
public var runAnimationSpeed : float = 2.0;
public var shotAnimationSpeed : float = 0.5;

// Camera Rotation Limit.
public var minRotateY : float = -15;
public var maxRotateY : float = 60;

// Scope UI
public var scopeUI : GUITexture;
// Rocket Launcher
public var rocketLauncher : RocketLauncher;
// Shot params
private var b_isPrepare : boolean = false;
private var b_isShot : boolean = false;

// Mouse Look
private var mouseLook : MouseLook_JS;

// Character motor.
private var motor : CharacterMotor; 

// Use this for initialization
function Awake () {
	motor = GetComponent(CharacterMotor);
	
	// Hide cursor
	Screen.showCursor = false;
	// Setup the character move speed to walk speed.
	int_moveSpeed = walkAnimationSpeed;
	
	// Get MouseLook component.
	mouseLook = Camera.main.GetComponent(MouseLook_JS);
	
	// Setup animation.
//	_animation[walkAnimation.name].speed = walkAnimationSpeed;
//	_animation[walkAnimation.name].wrapMode = WrapMode.Loop;
//	
//	_animation[runAnimation.name].speed = runAnimationSpeed;
//	_animation[runAnimation.name].wrapMode = WrapMode.Loop;
//	
//	_animation[idleAnimation.name].speed = idleAnimationSpeed;
//	_animation[idleAnimation.name].wrapMode = WrapMode.Loop;
	_animator = player.GetComponent(Animator);
//	_animator = _animator.GetComponent(Animator);
}

// Update is called once per frame
function Update () {
	// Get the input vector from kayboard or analog stick
	var directionVector = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
	
	if (directionVector != Vector3.zero) {
		// Get the length of the directon vector and then normalize it
		// Dividing by the length is cheaper than normalizing when we already have the length anyway
		var directionLength = directionVector.magnitude;
		directionVector = directionVector / directionLength;
		
		// Make sure the length is no bigger than 1
		directionLength = Mathf.Min(1, directionLength);
		
		// Make the input vector more sensitive towards the extremes and less sensitive in the middle
		// This makes it easier to control slow speeds when using analog sticks
		directionLength = directionLength * directionLength;
		
		// Multiply the normalized direction vector by the modified length
		directionVector = directionVector * directionLength;
	}
	
	// Reload the rocket bullet
	if (Input.GetKey(KeyCode.R))
	{
		BroadcastMessage("Reload");
	}
	
	if (Input.GetKey(KeyCode.E))
	{
		// Show the Scope UI.
		scopeUI.enabled = true;
		
		// Set the max and min limit rotation on Y - axis for the main camera.
		mouseLook.minimumY = minRotateY;
		mouseLook.maximumY = maxRotateY;
		
		// checking if the character is playing the shot animation.
		if (!b_isPrepare)
		{
			b_isShot = false;
			// Play the shot preparing animation function
			WaitForPrepare();
		}
		else
		{
			// If the player click fire play the shot animation again.
			if (Input.GetButton("Fire1") && (!b_isShot))
			{
				b_isShot = true;
				// Play the shot animation function.
				WaitForShot();
			}
		}
		
		// No movement direction
		motor.inputMoveDirection = Vector3.zero;
	}
	else
	{
		// Hide the  scope UI
		scopeUI.enabled = false;
		// Set the prepare animation to false.
		b_isPrepare = false;
		_animator.SetBool("isShot", false);
		
		// No Y-axis rotation.
		mouseLook.minimumY = 0;
		mouseLook.maximumY = 0;
		// Change the movement speed of the character.
		if (Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift))
		{
			int_moveSpeed = runSpeed;
		}
		else
		{
			int_moveSpeed = walkSpeed;
		}
		motor.movement.maxForwardSpeed = int_moveSpeed;
		motor.movement.maxSidewaysSpeed = int_moveSpeed;
		motor.movement.maxBackwardsSpeed = int_moveSpeed;
		
		// check if the character is moving or not.
		if (directionVector != Vector3.zero)
		{
			if (int_moveSpeed == walkSpeed)
			{	// Do walk animation.
//				_animator // SetFloat? SetBool?
//				_animation.CrossFade(walkAnimation.name);
				_animator.SetFloat("speed", walkAnimationSpeed);
			}
			else
			{	// Do runAnimation.
//				_animation.CrossFade(runAnimation.name);
				_animator.SetFloat("speed", runAnimationSpeed);
			}
		}
		else
		{	// Do idle animation.
//			_animation.CrossFade(idleAnimation.name);
			_animator.SetFloat("speed", idleAnimationSpeed);
		}
		
		// Apply the direction to the characterMoter.
		motor.inputMoveDirection = transform.rotation * directionVector;
		motor.inputJump = Input.GetButton("Jump");
	}
}

private function WaitForShot() : IEnumerator
{
	_animator.SetBool("isShot", true);
	// call fire function in attached scripts of this gameObject or any of its children.
	BroadcastMessage("Fire", shotAnimation.length);
	yield WaitForSeconds(shotAnimation.length);
	_animator.SetBool("isShot", false);
	b_isShot = false;
}

private function WaitForPrepare() : IEnumerator
{
//	_animator.SetBool("isShot", true);
	
	yield WaitForSeconds(shotAnimation.length);
	b_isPrepare = true;
}

// Require a character controller to be attached to the same game object
@script RequireComponent (CharacterMotor)
@script AddComponentMenu ("Character/New 3PS Controller")
