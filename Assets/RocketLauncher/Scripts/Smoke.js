#pragma strict

public var timeOut : float = 0.5;	// Destroy after 0.5 second.


function Start () {
	Invoke("KillObject", timeOut);
}

function Update () {

}

public function KillObject() : void
{
	// Stop the emit the particle
	var emitter : ParticleEmitter = GetComponentInChildren(ParticleEmitter);
	if (emitter != null)
	{
		emitter.emit = false; 	// Stop Emit.
	}
	
	// Here we set the particle to auto destruct to destroy itself after 
	// a life time (or we can setup it up in the editor)
	var particleAnimator : ParticleAnimator = GetComponentInChildren(ParticleAnimator);
	if (particleAnimator != null)
	{
		particleAnimator.autodestruct = true;
	}
}