#pragma strict

public var rocketLauncher : RocketLauncher;
public var customSkin : GUISkin;
public var width : float = 80;
public var height : float = 25;
public var pixelShift : int = 2;

public function OnGUI() : void
{
	GUI.skin = customSkin;
	DrawShadowText(new Rect(Screen.width * transform.position.x, 
							(Screen.height * (1.0 - (transform.position.y - 0.005))), width, height),
		rocketLauncher.ammoCount.ToString(), 
		customSkin.GetStyle("RocketText"),
		Color.white);
}

public function DrawShadowText(position : Rect, text : String, style : GUIStyle, textColor : Color) :void
{
	var backupStyle : GUIStyle = style;
	// Draw a shadow text.
	style.normal.textColor = Color.black;
	// Shift 2 pixel left and 2 pixel bottom
	position.x += pixelShift;
	position.y += pixelShift;
	GUI.Label(position, text, style);
	
	// Draw a text
	style.normal.textColor = textColor;
	// shift pixel back.
	position.x -= pixelShift;
	position.y -= pixelShift;
	GUI.Label(position, text, style);
	style = backupStyle; 	// set style back.
}


function Start () {

}

function Update () {

}