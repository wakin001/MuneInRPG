using UnityEngine;
using System.Collections;

public class Menu : MonoBehaviour {
	
	// For toggle the open and close our menu window.
	// We made it static so that we can access this variable from everywhere.
	public static bool 		b_openMenu;
	
	// MenuSkin
	public GUISkin 			customSkin;
	// character background texture.
	public Texture			t_hero;
	// First info box background.
	public Texture			t_statusBox1;
	// Second info box background.
	public Texture			t_statusBox2;
	// skill box background texture.
	public Texture			t_skillBox;
	
	// the current full HP
	public int				fullHP = 9999;
	// the current full MP
	public int 				fullMP = 999;
	// the current hp
	public int				currentHP = 9999;
	// the current MP
	public int 				currentMP = 999;
	// current LV
	public int				currentLV = 99;
	// the current EXP.
	public int				currentEXP = 9999999;
	// current NEXT
	public int				currentNEXT = 99999;
	// current ATK
	public int				currentATK = 999;
	// current DEF
	public int				currentDEF = 999;
	// current AGI
	public int				currentAGI = 999;
	// current INT
	public int				currentINT = 999;
	// current LUC
	public int				currentLUC = 999;
	
	int						in_toolbar = 0;
	string[]				s_toolbars = {"STATUS", "INVENTORY", "EQUIPMENT"};
	Rect					r_hero = new Rect(19, 35, 225, 441);
	Rect					r_window = new Rect(10, 10, 640, 480);
	Rect					r_closeButton = new Rect(598, 8, 26, 22);
	Rect					r_tabButton = new Rect(35, 15, 480, 40);
	
	// weapons array that the character currently has.
	public Item[]			a_weapons;
	// armors array that the character currently has
	public Item[]			a_armors;
	// accessories rray that the character currently has
	public Item[]			a_accessories;
	// items array that the character currently has
	public Item[]			a_items;
	// skills array that the character currently has
	public Texture[]		a_skills;
	
	// current weapon that character use.
	Item					currentWeapon;
	// current armor that character use.
	Item					currentArmor;
	// current accessory that character use.
	Item					currentAccessory;
	// current item that character use.
	Item					currentItem;
	// current skill that character use.
	Texture					currentSkill;
	
	string					s_unequip = "UNEQUIP";
	string					s_none = "NONE";
	
	// Status Tab
	int						maxHP = 9999;
	int						maxMP = 999;
	int						maxLV = 99;
	int						maxEXP = 9999999;
	int						maxNEXT = 99999;
	int						maxATK = 999;
	int						maxDEF = 999;
	int						maxAGI = 999;
	int						maxINT = 999;
	int						maxLUC = 999;
	
	// Rect position for the GUI.
	Rect					r_statTexture1 = new Rect(252, 77, 331, 125);
	Rect					r_statTexture2 = new Rect(252, 244, 331, 142);
	Rect					r_hpLabel = new Rect(313, 75, 120, 25);
	Rect					r_mpLabel = new Rect(313, 100, 120, 25);
	Rect					r_lvLabel = new Rect(313, 124, 120, 25);
	Rect					r_expLabel = new Rect(313, 150, 120, 25);
	Rect					r_nextLabel = new Rect(313, 177, 120, 25);
	Rect					r_atkLabel = new Rect(529, 75, 50, 25);
	Rect					r_defLabel = new Rect(529, 100, 50, 25);
	Rect					r_agiLabel = new Rect(529, 124, 50, 25);
	Rect					r_intLabel = new Rect(529, 150, 50, 25);
	Rect					r_lucLabel = new Rect(529, 177, 50, 25);
	Rect					r_statBox = new Rect(237, 67, 360, 147);
	Rect					r_weaponBox = new Rect(237, 230, 360, 207);
	Rect					r_weaponLabel = new Rect(252, 264, 180, 40);
	Rect					r_armorLabel = new Rect(252, 324, 180, 40);
	Rect					r_accessLabel = new Rect(252, 386, 180, 40);
	Rect					r_skillTexture = new Rect(464, 288, 119, 117);
	Rect					r_skillBox = new Rect(460, 284, 127, 125);
	
	// GUIContent
	GUIContent				gui_weaponCon;
	GUIContent				gui_armorCon;
	GUIContent				gui_accessCon;
	GUIContent				gui_skillCon;
	
	// Item Tab
	Rect					r_itemBox = new Rect(237, 67, 360, 247);
	Rect					r_tipBox = new Rect(237, 330, 360, 107);
	Rect					r_itemButton = new Rect(257, 87, 340, 227);
	Rect					r_tipButton = new Rect(257, 350, 340, 87);
	Rect					r_verScroll = new Rect(600, 87, 20, 227);
	float					f_scrollPos = 1.0f;
	Vector2					scrollPosition = Vector2.zero;
	Vector2					scrollPosition2 = Vector2.zero;
	int						in_toolItems = 0;
	
	// Equip Tab
	Rect					r_equipBox = new Rect(237, 67, 360, 207);
	Rect					r_equipWeaponBox = new Rect(237, 280, 360, 157);
	Rect					r_statTextureEquip = new Rect(252, 81, 331, 142);
	Rect					r_skillBoxEquip = new Rect(460, 121, 127, 125);
	
	// THe position of each equip button from 0 - weapon, 1 - armor, 2 - accessory, 3 - skill
	Rect[]					r_equipRect = { new Rect(252, 101, 180, 40), 
		new Rect(252, 161, 180, 40),
		new Rect(252, 221, 180, 40),
		new Rect(464, 125, 119, 117)};
	Rect					r_equipWindow = new Rect(500, 0, 70, 100);
	Vector2					scrollPosition3 = Vector2.zero;
	Vector2					scrollPosition4 = Vector2.zero;
	Vector2					scrollPosition5 = Vector2.zero;
	Vector2					scrollPosition6 = Vector2.zero;
	bool[]					a_equipBoolean = new bool[4];
	int						in_toolWeapons = 0;
	int						in_toolArmors = 0;
	int						in_toolAccess = 0;
	int						in_toolskill = 0;
	
	
	// Use this for initialization
	void Start () {
	
		b_openMenu = false;
		
		gui_weaponCon = new GUIContent(s_unequip);
		gui_armorCon = new GUIContent(s_unequip);
		gui_accessCon = new GUIContent(s_unequip);
		gui_skillCon = new GUIContent("");
		
		if (a_items.Length > 0)
		{
			a_items[0].setupItemName();
			currentItem = a_items[0];
		}
		
		// setup bool equip
		for (int i = 0; i < a_equipBoolean.Length; ++i)
		{
			a_equipBoolean[i] = false;
		}
	}
	
	// Update is called once per frame
	void Update () {
		// When the use press M key show the menu window.
		if (Input.GetKey(KeyCode.M))
		{
			if (!b_openMenu)
			{
				b_openMenu = true;
			}
		}
	}
	
	// All GUI class will create in this function.
	void OnGUI()
	{
		// Assgin our menuSkin to the Gui skin.
		GUI.skin = customSkin;
		if (b_openMenu)
		{
			// create a menu window by the size of rect.
			r_window = GUI.Window(0, r_window, DoMyWindow, "");
			// Make sure our window cannot be dragged outside of the screen area.
			r_window.x = Mathf.Clamp(r_window.x, 0.0f, Screen.width - r_window.width);
			r_window.y = Mathf.Clamp(r_window.y, 0.0f, Screen.height - r_window.height);
		}
	}
	
	void DoMyWindow(int windowID)
	{
		// We create tab button here.
		in_toolbar = GUI.Toolbar(r_tabButton, in_toolbar, s_toolbars, GUI.skin.GetStyle("Tab Button"));
		switch (in_toolbar)
		{
		case 0:	// Status
			// Create a status page.
			StatusWindow();
			break;
			
		case 1: // Items.
			// Create an item page.
			ItemWindow();
			break;
			
		case 2: // Equip.
			// Create an equeipment page.
			EquipWindow();
			break;
		}
		
		// Draw out background character texture.
		GUI.DrawTexture(r_hero, t_hero);
		
		// We create a close button here.
		if (GUI.Button(r_closeButton, "", GUI.skin.GetStyle("Exit Button")))
		{
			b_openMenu = false;
		}
		
		// Make our window dragable in whole area.
		GUI.DragWindow();
	}
	
	private void StatusWindow()
	{
		GUI.Box(r_statBox, "");
		GUI.Box(r_weaponBox, "");
		GUI.DrawTexture(r_statTexture1, t_statusBox1);
		GUI.DrawTexture(r_statTexture2, t_statusBox2);
		GUI.DrawTexture(r_skillBox, t_skillBox);
		
		CheckMax();
		
		GUI.Label(r_hpLabel, currentHP.ToString() + "/" + fullHP.ToString(), "Text Amount");
		GUI.Label(r_mpLabel, currentMP.ToString() + "/" + fullHP.ToString(), "Text Amount");
		GUI.Label(r_lvLabel, currentLV.ToString(), "Text Amount");
		GUI.Label(r_expLabel, currentEXP.ToString(), "Text Amount");
		GUI.Label(r_nextLabel, currentNEXT.ToString(), "Text Amount");
		GUI.Label(r_atkLabel, currentATK.ToString(), "Text Amount");
		GUI.Label(r_defLabel, currentDEF.ToString(), "Text Amount");
		GUI.Label(r_agiLabel, currentAGI.ToString(), "Text Amount");
		GUI.Label(r_intLabel, currentINT.ToString(), "Text Amount");
		GUI.Label(r_lucLabel, currentLUC.ToString(), "Text Amount");
		GUI.Label(r_weaponLabel, gui_weaponCon, "Text Item");
		GUI.Label(r_armorLabel, gui_armorCon, "Text Item");
		GUI.Label(r_accessLabel, gui_accessCon, "Text Item");
		GUI.Label(r_skillTexture, gui_skillCon, "Text Item");
	}
	
	void CheckMax()
	{
		fullHP = (int)Mathf.Clamp(fullHP, 0.0f, maxHP);
		fullMP = (int)Mathf.Clamp(fullMP, 0.0f, maxMP);
		currentHP = (int)Mathf.Clamp(currentHP, 0.0f, fullHP);
		currentMP = (int)Mathf.Clamp(currentMP, 0.0f, fullMP);
		currentLV = (int)Mathf.Clamp(currentLV, 0.0f, maxLV);
		currentEXP = (int)Mathf.Clamp(currentEXP, 0.0f, maxEXP);
		currentNEXT = (int)Mathf.Clamp(currentNEXT, 0.0f, maxNEXT);
		currentATK = (int)Mathf.Clamp(currentATK, 0.0f, maxATK);
		currentDEF = (int)Mathf.Clamp(currentDEF, 0.0f, maxDEF);
		currentAGI = (int)Mathf.Clamp(currentAGI, 0.0f, maxAGI);
		currentINT = (int)Mathf.Clamp(currentINT, 0.0f, maxINT);
		currentLUC = (int)Mathf.Clamp(currentLUC, 0.0f, maxLUC);
	}
	
	private void ItemWindow()
	{
		int in_items = 8;
		// create item information box
		GUI.Box(r_itemBox, "");
		GUI.Box(r_tipBox, "");
		
		scrollPosition = GUI.BeginScrollView(new Rect(257, 87, 320, 200),
			scrollPosition, 
			new Rect(0, 0, 280, 40 * in_items));
		// We just add a single label to go inside the scroll view.
		// Note how the scrollbars will work correctly with wordwrap.
		GUIContent[] itemsContent = new GUIContent[in_items];
		// Create a GUIContent array of key item here (if you have more than 1 items, you
		// can also use your item array instead of the current item.)
		for (int i = 0; i < in_items; i++)
		{
			if (a_items.Length > 0)
			{
				if (i == 0)
				{
					itemsContent[i] = new GUIContent(currentItem.ItemName, 
						currentItem.icon, 
						"item tooltip...");
				}
				else
				{
					itemsContent[i] = new GUIContent(currentItem.ItemName, 
						currentItem.icon, 
						"This is key " + i);
				}
			}
			else
			{
				itemsContent[i] = new GUIContent("NONE", "");
			}
		}
		
		// create the grid button here.
		in_toolItems = GUI.SelectionGrid(new Rect(0, 0, 280, 40 * in_items), 
			in_toolItems, 
			itemsContent, 
			1, 
			GUI.skin.GetStyle("Selected Item"));
		GUI.EndScrollView();	// End scroll area.
		
		// Checking if there is an item information.
		string s_info = itemsContent[in_toolItems].tooltip;
		if (s_info == "")
		{
			s_info = "Show items information here.";
		}
		GUIStyle style = GUI.skin.GetStyle("Label");
		if (GUI.tooltip != "")
		{
			// Get height from this style.
			float f_height = style.CalcHeight(new GUIContent(GUI.tooltip), 330.0f);
			scrollPosition2 = GUI.BeginScrollView(new Rect(257, 343, 320, 75),
				scrollPosition2, 
				new Rect(0, 0, 280, f_height));
			GUI.Label(new Rect(0, 0, 280, f_height), GUI.tooltip);
		}
		else
		{
			float f_height = style.CalcHeight(new GUIContent(s_info), 330.0f);
			scrollPosition2 = GUI.BeginScrollView(new Rect(257, 343, 320, 75),
				scrollPosition2, 
				new Rect(0, 0, 280, f_height));
			GUI.Label(new Rect(0, 0, 280, f_height), s_info);
		}
		GUI.EndScrollView();
	}
	
	void EquipWindow()
	{
		GUI.Box(r_equipBox, "");
		GUI.Box(r_equipWeaponBox, "");
		GUI.DrawTexture(r_statTextureEquip, t_statusBox2);
		GUI.DrawTexture(r_skillBoxEquip, t_skillBox);
		
		SetupEquipBox();
	}
	
	// setting the ability ot enable or disable the button.
	void SetupEquipBox()
	{
		GUIContent[] equipContent = {gui_weaponCon, gui_armorCon, gui_accessCon, gui_skillCon};
		for (int i = 0; i < equipContent.Length; ++i)
		{
			if (a_equipBoolean[i])
			{
				// Set up the disable button
				GUI.Label(r_equipRect[i], equipContent[i], "Disable click");
				// show each equipment window.
				switch (i)
				{
				case 0:
					ShowWeapon();
					break;
				case 1:
					ShowArmor();
					break;
				case 2:
					ShowAccess();
					break;
				case 3:
					ShowSkill();
					break;
				}
			}
			else
			{
				// set up the enabled button.
				if (GUI.Button(r_equipRect[i], equipContent[i], "Selected Item"))
				{
					a_equipBoolean[i] = true;
					// set others to false.
					for (int j = 0; j < a_equipBoolean.Length; ++j)
					{
						if (i != j)
						{
							a_equipBoolean[j] = false;
						}
					}
				}
			}
		}
	}
	
	void ShowWeapon()
	{
		int in_items = 6;
		GUIContent[] itemsContent = new GUIContent[in_items];
		// we create a GUIContent array of key item here (if you have more than 1 item, 
		// you also use your item array instend of current item.)
		for (int i = 0; i < in_items; i++)
		{
			if (i == 0)
			{
				itemsContent[i] = new GUIContent(s_unequip, "");
			}
			else
			{
				itemsContent[i] = new GUIContent(a_weapons[0].name, a_weapons[0].icon);
			}
		}
		scrollPosition3 = GUI.BeginScrollView(new Rect(257, 300, 320, 120),
			scrollPosition3,
			new Rect(0, 0, 280, 40 * in_items));
		// create grid button.
		in_toolWeapons = GUI.SelectionGrid(new Rect(0, 0, 280, 40 * in_items),
			in_toolWeapons, itemsContent, 1, GUI.skin.GetStyle("Selected Item"));
		// End the scrollview we began above.
		GUI.EndScrollView();
		
		gui_weaponCon = itemsContent[in_toolWeapons];
	}
	
	void ShowArmor()
	{
		int in_items = 6;
		GUIContent[] itemsContent = new GUIContent[in_items];
		// we create a GUIContent array of key item here (if you have more than 1 item, 
		// you also use your item array instend of current item.)
		for (int i = 0; i < in_items; i++)
		{
			if (i == 0)
			{
				itemsContent[i] = new GUIContent(s_unequip, "");
			}
			else
			{
				itemsContent[i] = new GUIContent(a_armors[0].name, a_armors[0].icon);
			}
		}
		scrollPosition3 = GUI.BeginScrollView(new Rect(257, 300, 320, 120),
			scrollPosition3,
			new Rect(0, 0, 280, 40 * in_items));
		// create grid button.
		in_toolArmors = GUI.SelectionGrid(new Rect(0, 0, 280, 40 * in_items),
			in_toolArmors, itemsContent, 1, GUI.skin.GetStyle("Selected Item"));
		// End the scrollview we began above.
		GUI.EndScrollView();
		
		gui_armorCon = itemsContent[in_toolArmors];
	}
	
	void ShowAccess()
	{
		int in_items = 6;
		GUIContent[] itemsContent = new GUIContent[in_items];
		// we create a GUIContent array of key item here (if you have more than 1 item, 
		// you also use your item array instend of current item.)
		for (int i = 0; i < in_items; i++)
		{
			if (i == 0)
			{
				itemsContent[i] = new GUIContent(s_unequip, "");
			}
			else
			{
				itemsContent[i] = new GUIContent(a_accessories[0].name, a_accessories[0].icon);
			}
		}
		scrollPosition3 = GUI.BeginScrollView(new Rect(257, 300, 320, 120),
			scrollPosition3,
			new Rect(0, 0, 280, 40 * in_items));
		// create grid button.
		in_toolAccess = GUI.SelectionGrid(new Rect(0, 0, 280, 40 * in_items),
			in_toolAccess, itemsContent, 1, GUI.skin.GetStyle("Selected Item"));
		// End the scrollview we began above.
		GUI.EndScrollView();
		
		gui_accessCon = itemsContent[in_toolAccess];
	}
	
	void ShowSkill()
	{
		int in_items = a_skills.Length + 1;
		GUIContent[] itemsContent = new GUIContent[in_items];
		// we create a GUIContent array of key item here (if you have more than 1 item, 
		// you also use your item array instend of current item.)
		for (int i = 0; i < in_items; i++)
		{
			if (i == 0)
			{
				itemsContent[i] = new GUIContent(t_skillBox);
			}
			else
			{
				itemsContent[i] = new GUIContent(a_skills[i - 1]);
			}
		}
		scrollPosition3 = GUI.BeginScrollView(new Rect(253, 286, 330, 140),
			scrollPosition3,
			new Rect(0, 0, 600, 117));
		// create grid button.
		in_toolskill = GUI.SelectionGrid(new Rect(0, 4, 600, 117),
			in_toolskill, itemsContent, in_items, GUI.skin.GetStyle("Selected Item"));
		// End the scrollview we began above.
		GUI.EndScrollView();
		if (in_toolskill != 0)
		{
			gui_skillCon = itemsContent[in_toolskill];
		}
		else
		{
			gui_skillCon = new GUIContent("");
		}
	}
	
	
	
	// Let Item variables can be shown in the editor.
	[System.Serializable]
	public class Item
	{
		public Texture			icon;
		public string			name;
		public int 				amount;
		
		string 					itemName;
		
		// This function is just to put the space between name of the item and amount of the item.
		public void setupItemName()
		{
			int in_length = this.name.Length + this.amount.ToString().Length;
			if (in_length < 25)
			{
				while (this.name.Length < 17)
				{
				this.name += " ";
				}
			}
			if (this.amount < 10)
			{
				itemName = this.name + " " + this.amount.ToString();
			}
			else
			{
				itemName = this.name + this.amount.ToString();
			}
		}
		
		public string ItemName
		{
			get {	return itemName;	}
			set { 	itemName = value;	}
		}
		
		public string Name
		{
			get {	return name; 	}
			set {	name = value; 	}
		}
	}
}


