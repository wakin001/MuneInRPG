Shader "MyShader/Toon Rim Light" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_BumpMap ("Bumpmap", 2D) = "bump" {}
		_AmbientColor = ("Ambient Color", Color) = (0.1f, 0.1f, 0.1f, 1.0f)
		_SpecularColor = ("Specular Color", Color) = (0.12f, 0.31f, 0.47f, 1.0f)
		_Glossiness = ("Gloss", Range(1.0f, 512.0f)) = 80.0f
	}
	SubShader {
		Tags { "RenderType"="Opaque" }
		LOD 400
		
		CGPROGRAM
		// Custom lighting funciton that uses a texture ramp based on angle between light direction and normal.
		// Our custom function LightingRampSpecular will be called.
		#pragma surface surf RampSpecular
//		#pragma surface surf Lambert

		sampler2D _MainTex;
		sampler2D _BumpMap;
		
		fixed4 _AmbientColor;
		fixed4 _SpecularColor;
		half _Glossiness;

		struct Input {
			float2 uv_MainTex;
			float2 uv_BumpMap;
		};

		void surf (Input IN, inout SurfaceOutput o) 
		{
			fixed4 c = tex2D(_MainTex, IN.uv_MainTex);
//			half4 c = tex2D (_MainTex, IN.uv_MainTex);
			o.Albedo = c.rgb;
			o.Alpha = c.a;
			o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));
		}
		
		inline fixed4 LightingRampSpecular (SurfaceOutput s, fixed3 lightDir, fixed3 viewDir, fixed atten)
		{
			// Ambient light
			fixed3 f3_ambient = s.Albedo * _AmbientColor.rgb;
			
			// Diffuse.
			// get the direction of the light source related of the normal of character.
			fixed NdotL = saturate(dot(s.Normal, lightDir));
			fixed3 f3_diffuse = s.Albedo * _LightColor0.rgb * NdotL;
			
			// Specular - gloss
			// get the normalize of the lighting direction and view direction.
			fixed3 h = normalize(lightDir + viewDir);
			// make sure that the return number isn't lower than 0 or greater than 1
			float nh = saturate(dot(s.Normal, h));
			float specPower = pow(nh, _Glossiness);
			
			fixed3 f3_specular = _LightColor0.rgb * specPower * _SpecularColor.rgb;
			
			// Result
			fixed4 c;
			c.rgb = (f3_ambient + f3_diffuse + f3_specular) * (atten * 2);
			c.a = s.Alpha + (_LightColor0.a * _SpecularColor.a * specPower * atten);
			
			return c;
		}
		
		ENDCG
	} 
	FallBack "Diffuse"
}
