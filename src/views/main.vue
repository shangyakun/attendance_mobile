<template>
    <div>
    	<router-view></router-view>
        <footer-view></footer-view>
    </div>
</template>

<script>
import footerView from './footerView'
export default {
    name: 'App',
    components: {
        footerView
    }
}
</script>
