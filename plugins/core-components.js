import Vue from 'vue';

import AppButton from "@/components/UI/AppButton";
import AppControlInput from '@/components/UI/AppControlInput';
import PostList from "@/components/Posts/PostList";

//Register as global component for use everywhere
Vue.component('AppButton', AppButton);
Vue.component('AppControlInput', AppControlInput);
Vue.component('PostList', PostList);