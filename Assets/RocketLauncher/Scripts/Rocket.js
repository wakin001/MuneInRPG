#pragma strict

public var timeOut : float = 3.0;	// Destroy after 3.0 seconds.
public var explosionParticle : GameObject;

function Start () {
	// Call KillObject function after timeOut time.
	Invoke("KillObject", timeOut);
}

function Update () {

}

public function OnCollisionEnter (other : Collision) : void
{
	// Create the explosion on the first impact point of the rocket and collider.
	var contactPoint : ContactPoint = other.contacts[0];
	var rotation : Quaternion = Quaternion.FromToRotation(Vector3.up, contactPoint.normal);
	GameObject.Instantiate(explosionParticle, contactPoint.point, rotation);
	
	KillObject();
}

public function KillObject() : void
{
	// Stop the emit the particle.
	var emitter : ParticleEmitter = GetComponentInChildren(ParticleEmitter);
	if (emitter != null)
	{
		emitter.emit = false; //stop emit.
	}
	
	// Set the particle to auto destruct to destroy itself after a life time.
	var particleAnimator : ParticleAnimator = GetComponentInChildren(ParticleAnimator);
	if (particleAnimator != null)
	{
		particleAnimator.autodestruct = true;
	}
	
	// Detach the trail renderer in our particles
	transform.DetachChildren();
	
	// Destroy this object
	GameObject.Destroy(gameObject);
}

@script RequireComponent(ConstantForce)