/* eslint-disable */
(function () {
		const setRem = () => {
			document.documentElement.style.fontSize = document.documentElement.clientWidth / 18.75 + 'px'
		}
    setRem()
    window.onresize = setRem
}())

/* eslint-enable */
