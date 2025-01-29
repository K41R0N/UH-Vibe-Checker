/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_config_env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/config/env */ \"./src/lib/config/env.ts\");\n\n\n\n// Only validate environment variables server-side\nif (true) {\n    (0,_lib_config_env__WEBPACK_IMPORTED_MODULE_2__.validateEnv)();\n}\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Chale\\\\Cursor\\\\Vibe Checker\\\\pages\\\\_app.tsx\",\n        lineNumber: 11,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQThCO0FBRWdCO0FBRTlDLGtEQUFrRDtBQUNsRCxJQUFJLElBQWtCLEVBQWE7SUFDakNBLDREQUFXQTtBQUNiO0FBRWUsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBWTtJQUM1RCxxQkFBTyw4REFBQ0Q7UUFBVyxHQUFHQyxTQUFTOzs7Ozs7QUFDakMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92aWJlLWNoZWNrZXIvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xyXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnXHJcbmltcG9ydCB7IHZhbGlkYXRlRW52IH0gZnJvbSAnQC9saWIvY29uZmlnL2VudidcclxuXHJcbi8vIE9ubHkgdmFsaWRhdGUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHNlcnZlci1zaWRlXHJcbmlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xyXG4gIHZhbGlkYXRlRW52KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxufSJdLCJuYW1lcyI6WyJ2YWxpZGF0ZUVudiIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./src/lib/config/env.ts":
/*!*******************************!*\
  !*** ./src/lib/config/env.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   validateEnv: () => (/* binding */ validateEnv)\n/* harmony export */ });\nfunction validateEnv() {\n    const requiredEnvVars = [\n        \"OPENWEATHER_API_KEY\",\n        \"OPENAI_API_KEY\"\n    ];\n    for (const envVar of requiredEnvVars){\n        if (!process.env[envVar]) {\n            console.error(`Missing required environment variable: ${envVar}`);\n            return false;\n        }\n    }\n    return true;\n}\nconst config = {\n    openWeatherKey: process.env.OPENWEATHER_API_KEY,\n    openAIKey: process.env.OPENAI_API_KEY,\n    cache: {\n        ttl: parseInt(process.env.CACHE_TTL || \"3600\"),\n        checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || \"120\")\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2NvbmZpZy9lbnYudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBTyxTQUFTQTtJQUNkLE1BQU1DLGtCQUFrQjtRQUN0QjtRQUNBO0tBQ0Q7SUFFRCxLQUFLLE1BQU1DLFVBQVVELGdCQUFpQjtRQUNwQyxJQUFJLENBQUNFLFFBQVFDLEdBQUcsQ0FBQ0YsT0FBTyxFQUFFO1lBQ3hCRyxRQUFRQyxLQUFLLENBQUMsQ0FBQyx1Q0FBdUMsRUFBRUosT0FBTyxDQUFDO1lBQ2hFLE9BQU87UUFDVDtJQUNGO0lBQ0EsT0FBTztBQUNUO0FBRU8sTUFBTUssU0FBUztJQUNwQkMsZ0JBQWdCTCxRQUFRQyxHQUFHLENBQUNLLG1CQUFtQjtJQUMvQ0MsV0FBV1AsUUFBUUMsR0FBRyxDQUFDTyxjQUFjO0lBQ3JDQyxPQUFPO1FBQ0xDLEtBQUtDLFNBQVNYLFFBQVFDLEdBQUcsQ0FBQ1csU0FBUyxJQUFJO1FBQ3ZDQyxhQUFhRixTQUFTWCxRQUFRQyxHQUFHLENBQUNhLGtCQUFrQixJQUFJO0lBQzFEO0FBQ0YsRUFBVyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpYmUtY2hlY2tlci8uL3NyYy9saWIvY29uZmlnL2Vudi50cz83M2I0Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVudigpIHtcclxuICBjb25zdCByZXF1aXJlZEVudlZhcnMgPSBbXHJcbiAgICAnT1BFTldFQVRIRVJfQVBJX0tFWScsXHJcbiAgICAnT1BFTkFJX0FQSV9LRVknXHJcbiAgXTtcclxuXHJcbiAgZm9yIChjb25zdCBlbnZWYXIgb2YgcmVxdWlyZWRFbnZWYXJzKSB7XHJcbiAgICBpZiAoIXByb2Nlc3MuZW52W2VudlZhcl0pIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgTWlzc2luZyByZXF1aXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZTogJHtlbnZWYXJ9YCk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XHJcbiAgb3BlbldlYXRoZXJLZXk6IHByb2Nlc3MuZW52Lk9QRU5XRUFUSEVSX0FQSV9LRVksXHJcbiAgb3BlbkFJS2V5OiBwcm9jZXNzLmVudi5PUEVOQUlfQVBJX0tFWSxcclxuICBjYWNoZToge1xyXG4gICAgdHRsOiBwYXJzZUludChwcm9jZXNzLmVudi5DQUNIRV9UVEwgfHwgJzM2MDAnKSxcclxuICAgIGNoZWNrUGVyaW9kOiBwYXJzZUludChwcm9jZXNzLmVudi5DQUNIRV9DSEVDS19QRVJJT0QgfHwgJzEyMCcpXHJcbiAgfVxyXG59IGFzIGNvbnN0OyAiXSwibmFtZXMiOlsidmFsaWRhdGVFbnYiLCJyZXF1aXJlZEVudlZhcnMiLCJlbnZWYXIiLCJwcm9jZXNzIiwiZW52IiwiY29uc29sZSIsImVycm9yIiwiY29uZmlnIiwib3BlbldlYXRoZXJLZXkiLCJPUEVOV0VBVEhFUl9BUElfS0VZIiwib3BlbkFJS2V5IiwiT1BFTkFJX0FQSV9LRVkiLCJjYWNoZSIsInR0bCIsInBhcnNlSW50IiwiQ0FDSEVfVFRMIiwiY2hlY2tQZXJpb2QiLCJDQUNIRV9DSEVDS19QRVJJT0QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/lib/config/env.ts\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();