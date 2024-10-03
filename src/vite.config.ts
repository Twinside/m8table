import { defineConfig } from "vite";
import preact from '@preact/preset-vite';

const noAttr = () => {
  return {
    name: "no-attribute",
    transformIndexHtml(html : any) {
      return html.replace('type="module" ', "").replace("crossorigin", "");
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [preact(), noAttr() ],
	build: {
	    /*
		minify: false,
		terserOptions: {
			compress: false,
			mangle: false,
		}, // */
	},
});
