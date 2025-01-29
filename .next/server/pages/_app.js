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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_config_env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/config/env */ \"./src/lib/config/env.ts\");\n\n\n\n// Validate environment variables during development\nif (true) {\n    (0,_lib_config_env__WEBPACK_IMPORTED_MODULE_2__.validateEnv)();\n}\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\Chale\\\\Cursor\\\\Vibe Checker\\\\pages\\\\_app.tsx\",\n        lineNumber: 11,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQThCO0FBRWdCO0FBRTlDLG9EQUFvRDtBQUNwRCxJQUFJQyxJQUF5QixFQUFlO0lBQzFDRCw0REFBV0E7QUFDYjtBQUVlLFNBQVNFLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQU8sOERBQUNEO1FBQVcsR0FBR0MsU0FBUzs7Ozs7O0FBQ2pDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmliZS1jaGVja2VyLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcclxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJ1xyXG5pbXBvcnQgeyB2YWxpZGF0ZUVudiB9IGZyb20gJ0AvbGliL2NvbmZpZy9lbnYnXHJcblxyXG4vLyBWYWxpZGF0ZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgZHVyaW5nIGRldmVsb3BtZW50XHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xyXG4gIHZhbGlkYXRlRW52KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxufSJdLCJuYW1lcyI6WyJ2YWxpZGF0ZUVudiIsInByb2Nlc3MiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./src/lib/config/env.ts":
/*!*******************************!*\
  !*** ./src/lib/config/env.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   validateEnv: () => (/* binding */ validateEnv)\n/* harmony export */ });\nfunction validateEnv() {\n    const requiredEnvVars = [\n        \"OPENWEATHER_API_KEY\",\n        \"OPENAI_API_KEY\"\n    ];\n    const missingEnvVars = requiredEnvVars.filter((envVar)=>!process.env[envVar]);\n    if (missingEnvVars.length > 0) {\n        throw new Error(`Missing required environment variables: ${missingEnvVars.join(\", \")}`);\n    }\n}\nconst config = {\n    openWeatherKey: process.env.OPENWEATHER_API_KEY,\n    openAIKey: process.env.OPENAI_API_KEY,\n    cache: {\n        ttl: parseInt(process.env.CACHE_TTL || \"3600\"),\n        checkPeriod: parseInt(process.env.CACHE_CHECK_PERIOD || \"120\")\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL2NvbmZpZy9lbnYudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBTyxTQUFTQTtJQUNkLE1BQU1DLGtCQUFrQjtRQUN0QjtRQUNBO0tBQ0Q7SUFFRCxNQUFNQyxpQkFBaUJELGdCQUFnQkUsTUFBTSxDQUMzQyxDQUFDQyxTQUFXLENBQUNDLFFBQVFDLEdBQUcsQ0FBQ0YsT0FBTztJQUdsQyxJQUFJRixlQUFlSyxNQUFNLEdBQUcsR0FBRztRQUM3QixNQUFNLElBQUlDLE1BQ1IsQ0FBQyx3Q0FBd0MsRUFBRU4sZUFBZU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUUxRTtBQUNGO0FBRU8sTUFBTUMsU0FBUztJQUNwQkMsZ0JBQWdCTixRQUFRQyxHQUFHLENBQUNNLG1CQUFtQjtJQUMvQ0MsV0FBV1IsUUFBUUMsR0FBRyxDQUFDUSxjQUFjO0lBQ3JDQyxPQUFPO1FBQ0xDLEtBQUtDLFNBQVNaLFFBQVFDLEdBQUcsQ0FBQ1ksU0FBUyxJQUFJO1FBQ3ZDQyxhQUFhRixTQUFTWixRQUFRQyxHQUFHLENBQUNjLGtCQUFrQixJQUFJO0lBQzFEO0FBQ0YsRUFBVyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZpYmUtY2hlY2tlci8uL3NyYy9saWIvY29uZmlnL2Vudi50cz83M2I0Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVudigpIHtcclxuICBjb25zdCByZXF1aXJlZEVudlZhcnMgPSBbXHJcbiAgICAnT1BFTldFQVRIRVJfQVBJX0tFWScsXHJcbiAgICAnT1BFTkFJX0FQSV9LRVknXHJcbiAgXTtcclxuXHJcbiAgY29uc3QgbWlzc2luZ0VudlZhcnMgPSByZXF1aXJlZEVudlZhcnMuZmlsdGVyKFxyXG4gICAgKGVudlZhcikgPT4gIXByb2Nlc3MuZW52W2VudlZhcl1cclxuICApO1xyXG5cclxuICBpZiAobWlzc2luZ0VudlZhcnMubGVuZ3RoID4gMCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICBgTWlzc2luZyByZXF1aXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXM6ICR7bWlzc2luZ0VudlZhcnMuam9pbignLCAnKX1gXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcclxuICBvcGVuV2VhdGhlcktleTogcHJvY2Vzcy5lbnYuT1BFTldFQVRIRVJfQVBJX0tFWSEsXHJcbiAgb3BlbkFJS2V5OiBwcm9jZXNzLmVudi5PUEVOQUlfQVBJX0tFWSEsXHJcbiAgY2FjaGU6IHtcclxuICAgIHR0bDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuQ0FDSEVfVFRMIHx8ICczNjAwJyksXHJcbiAgICBjaGVja1BlcmlvZDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuQ0FDSEVfQ0hFQ0tfUEVSSU9EIHx8ICcxMjAnKVxyXG4gIH1cclxufSBhcyBjb25zdDsgIl0sIm5hbWVzIjpbInZhbGlkYXRlRW52IiwicmVxdWlyZWRFbnZWYXJzIiwibWlzc2luZ0VudlZhcnMiLCJmaWx0ZXIiLCJlbnZWYXIiLCJwcm9jZXNzIiwiZW52IiwibGVuZ3RoIiwiRXJyb3IiLCJqb2luIiwiY29uZmlnIiwib3BlbldlYXRoZXJLZXkiLCJPUEVOV0VBVEhFUl9BUElfS0VZIiwib3BlbkFJS2V5IiwiT1BFTkFJX0FQSV9LRVkiLCJjYWNoZSIsInR0bCIsInBhcnNlSW50IiwiQ0FDSEVfVFRMIiwiY2hlY2tQZXJpb2QiLCJDQUNIRV9DSEVDS19QRVJJT0QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/lib/config/env.ts\n");

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