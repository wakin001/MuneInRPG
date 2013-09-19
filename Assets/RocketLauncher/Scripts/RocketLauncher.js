#pragma strict

public var smoke : GameObject;
public var smokePosition : Transform;
public var rocket : ConstantForce;

public var speed : float = 10;
public var ammoCount : int = 20;

private var lastShot : float = 0.0;

function Start () {

}

function Update () {

}

public function Fire(_reloadTime : float) : void
{
	if (Time.time > (_reloadTime * lastShot) && ammoCount > 0)
	{
		var rocketPrefab : ConstantForce = ConstantForce.Instantiate(rocket, transform.position, transform.rotation);
		rocketPrefab.relativeForce = new Vector3(0, 0, speed);
		
		var smoke:GameObject = GameObject.Instantiate(smoke, smokePosition.position, smokePosition.rotation);
		
		// We ignore the collision between rocket and character.
		Physics.IgnoreCollision(rocketPrefab.collider, transform.root.collider);
		
		// Get the last shot time.
		lastShot = Time.time;
		// Decrease the bullet.
		ammoCount--;
	}
}

public function Reload() : void
{
	ammoCount = 20;
}