#version 450

layout (binding = 0) uniform sampler2D samplerposition;
layout (binding = 1) uniform sampler2D samplerNormal;
layout (binding = 2) uniform sampler2D samplerAlbedo;
layout (binding = 3) uniform sampler2D samplerSSAO;
layout (binding = 4) uniform sampler2D samplerSSAOBlur;
layout (binding = 5) uniform UBO 
{
	mat4 _dummy;
	int ssao;
	int ssaoOnly;
	int ssaoBlur;
} uboParams;

layout (location = 0) in vec2 inUV;

layout (location = 0) out vec4 outFragColor;

layout(binding = 16) uniform DRS_PARAM {
    lowp vec2 drs_ratio;
} drs_param;
#define DYNAMIC_RESOLUTION_UV(uv) (uv * drs_param.drs_ratio)

void main() 
{
    vec2 _inUV = DYNAMIC_RESOLUTION_UV(inUV);
    
	vec3 fragPos = texture(samplerposition, _inUV).rgb;
	vec3 normal = normalize(texture(samplerNormal, _inUV).rgb * 2.0 - 1.0);
	vec4 albedo = texture(samplerAlbedo, _inUV);
	 
	float ssao = (uboParams.ssaoBlur == 1) ? texture(samplerSSAOBlur, _inUV).r : texture(samplerSSAO, _inUV).r;

	vec3 lightPos = vec3(0.0);
	vec3 L = normalize(lightPos - fragPos);
	float NdotL = max(0.5, dot(normal, L));

	if (uboParams.ssaoOnly == 1)
	{
		outFragColor.rgb = ssao.rrr;
	}
	else
	{
		vec3 baseColor = albedo.rgb * NdotL;

		if (uboParams.ssao == 1)
		{
			outFragColor.rgb = ssao.rrr;

			if (uboParams.ssaoOnly != 1)
				outFragColor.rgb *= baseColor;
		}
		else
		{
			outFragColor.rgb = baseColor;
		}
	}
}
