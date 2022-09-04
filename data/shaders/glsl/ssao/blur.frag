#version 450

layout (binding = 0) uniform sampler2D samplerSSAO;

layout (location = 0) in vec2 inUV;

layout (location = 0) out float outFragColor;

layout(binding = 16) uniform DRS_PARAM {
    lowp vec2 drs_ratio;
} drs_param;
#define DYNAMIC_RESOLUTION_UV(uv) (uv * drs_param.drs_ratio)

void main() 
{
	vec2 _inUV = DYNAMIC_RESOLUTION_UV(inUV);

	const int blurRange = 2;
	int n = 0;
	vec2 texelSize = 1.0 / vec2(textureSize(samplerSSAO, 0));
	float result = 0.0;
	for (int x = -blurRange; x < blurRange; x++) 
	{
		for (int y = -blurRange; y < blurRange; y++) 
		{
			vec2 offset = vec2(float(x), float(y)) * texelSize;
			result += texture(samplerSSAO, _inUV + offset).r;
			n++;
		}
	}
	outFragColor = result / (float(n));
}
