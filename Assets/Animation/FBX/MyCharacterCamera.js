#pragma strict
@script RequireComponent(MyCharacterController)

// Angular smooth
public var smoothTime : float = 0.1;
public var maxSpeed : float = 150.0;
public var heightSmoothTime : float = 0.1;
public var distance : float = 2.5;
public var height : float = 0.75;

private var f_heightVelocity : float = 0.0;
private var f_angleVelocity : float = 0.0;
private var v3_velocity : Vector3;

// transform
private var target : Transform;
private var cameraTransform : Transform;

private var f_maxRotation : float;

// Character controll
private var c_characterControl : MyCharacterController;

// target
private var f_targetHeight : float = Mathf.Infinity;
private var v3_centerOffset = Vector3.zero;

public function Awake() : void
{
	// get our main Camera from the scene.
	cameraTransform = Camera.main.transform;
	target = transform;
	c_characterControl = GetComponent(MyCharacterController);
	
	// get target center offset.
	/**
	*	A CharacterController allows you to easily do movement constrained by collisions without 
		having to deal with a rigidbody.
		A CharacterController is not affected by forces and will only move when you call the Move funtion. 
		It will then carry out the movement but be constrained by collisions.
	*/
	// target.collider :The Collider attached to this GameObject (null if there is none attached).
	var characterController : CharacterController = target.collider;
	v3_centerOffset = characterController.bounds.center - target.position;
}

function Start () {

}

function Update () {

}

public function LateUpdate() : void
{
	var v3_targetCenter : Vector3 = target.position + v3_centerOffset;
	
	// calculate the current & target rotation angles.
	var f_originalTargetAngle : float = target.eulerAngles.y;
	var f_currentAngle : float = cameraTransform.eulerAngles.y;
	var f_targetAngle : float = f_originalTargetAngle;
	
	// Lock the camera when moving backwards.
	// It is really confusing to do 180 degree spins when turning around. So we fixed the camera rotatioin.
	if (AngleDistance(f_currentAngle, f_targetAngle) > 160 && c_characterControl.IsMoveBackward())
	{
		f_targetAngle += 180;
	}
	// Apply rotation to the camera.
	// // Gradually changes an angle given in degrees towards a desired goal angle over time.
	f_currentAngle = Mathf.SmoothDampAngle(f_currentAngle, f_targetAngle, f_angleVelocity, smoothTime, maxSpeed);
	
	// Update camera height position
	f_targetHeight = v3_targetCenter.y + height;
	
	// Damp the height;
	var f_currentHeight : float = cameraTransform.position.y;
	// SmoothDamp: Gradually changes a value towards a desired goal over time.
	f_currentHeight = Mathf.SmoothDamp(f_currentHeight, f_targetHeight, f_heightVelocity, heightSmoothTime);
	
	// convert the angle into a rotation, by which we then reposition the camera.
	var q_currentRotation : Quaternion = Quaternion.Euler(0, f_currentAngle, 0);
	
	// Set the position of the camera on the x-z plane to  distance meters behind the target.
	cameraTransform.position = v3_targetCenter;
	cameraTransform.position += q_currentRotation * Vector3.back * distance;
	
	// Set the height of the camera.
	cameraTransform.position.y = f_currentHeight;
	
	// Always look at the target.
	SetUpRotation(v3_targetCenter);
}

public function SetUpRotation(v3_centerPos : Vector3)
{
	var v3_cameraPos = cameraTransform.position; // camera position.
	var v3_offsetToCenter : Vector3 = v3_centerPos - v3_cameraPos;
	
	 // get the camera center offset.
	 // generate base rotation only around y-axis.
	 /**
	 *	LookRotation:
	 	Creates a rotation with the specified forward and upwards directions.
		Returns the computed quaternion. If used to orient a Transform, the Z axis will be aligned 
		with forward and the Y axis with upwards if these vectors are orthogonal. 
		Logs an error if the forward direction is zero.
	 */
	 var q_yRotation : Quaternion = Quaternion.LookRotation(Vector3(v3_offsetToCenter.x, v3_offsetToCenter.y + height, v3_offsetToCenter.z));
	 // Apply the rotation to the camera.
	 // v3_relativeOffset: the relative offset between camera and target.
	 var v3_relativeOffset = Vector3.forward * distance + Vector3.down * height;
	 cameraTransform.rotation = q_yRotation * Quaternion.LookRotation(v3_relativeOffset); 
}

// get the angle distance between two angle
// This function took from the built-in Third-person Camera Script.
/**
*static function Repeat(t: float, length: float): float;
Description
Loops the value t, so that it is never larger than length and never smaller than 0.
This is similar to the modulo(%) operator but it works with floating point numbers.
*/
public function AngleDistance(a : float, b: float) : float
{
	// Loop the value a and b not ghigher than 360 and not lower than 0.
	a = Mathf.Repeat(a, 360); // a should always be [0, 360] for an angle.
	b = Mathf.Repeat(b, 360);
	return Mathf.Abs(b - a);
}

	