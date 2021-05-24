import typescript from '@rollup/plugin-typescript';

export default {
	input: './src/index.ts',
	output: {
		format: 'cjs',
		file: './output/bundle.js',
	},
	plugins: [typescript()],
};
