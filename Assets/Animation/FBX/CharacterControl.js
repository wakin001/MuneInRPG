#pragma strict

public var idleAnimation : AnimationClip;
public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;
public var jumpPoseAnimation : AnimationClip;
public var jumpDownAnimation : AnimationClip;

public var jumpAnimationSpeed : float = 4;
public var fallAnimationSpeed : float = 0.1;
public var walkAnimationSpeed : float = 1.5;
public var idleAnimationSpeed : float = 0.5;
public var runAnimationSpeed : float = 1.5;

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
	c_collisionFlags = CollisionFlags.CollidedBelow;
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
	v3_forward = cameraTransform.TransformDirection(Vector3.forward);
	v3_forward.y = 0;
	v3_right = new Vector3(v3_forward.z, 0, -v3_forward.x);
}


public function IsGrounded():boolean
{
	return (c_collisionFlags & CollisionFlags.CollidedBelow);
}

public function isJumping():boolean
{
	return b_isJumping;
}

public function isAir():boolean
{
	return (f_inAirTime > f_minAirTime);
}

public function IsMoveBackward():boolean
{
	return b_isBackward;
}
