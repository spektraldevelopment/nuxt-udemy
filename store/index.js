import Vuex from 'vuex';
import axios from 'axios';
import Cookie from 'js-cookie';

const createStore = () => {
	return new Vuex.Store({
		state: {
			loadedPosts: [],
			token: null
		},
		mutations: {
			setPosts(state, posts) {
				state.loadedPosts = posts;
			},
			addPost(state, post) {
				state.loadedPosts.push(post);
			},
			editPost(state, editedPost) {
				const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
				state.loadedPosts[postIndex] = editedPost;
			},
			setToken(state, token) {
				state.token = token;
			},
			clearToken(state) {
				state.token = null;
			}
		},
		actions: {
			nuxtServerInit(vuexContext, context) {
				return axios.get('https://nuxt-blog-d461c.firebaseio.com/posts.json')
					.then(result => {
						const postsArray = [];
						for (const key in result.data) {
							postsArray.push({
								...result.data[key],
								id: key
							});
						}
						vuexContext.commit('setPosts', postsArray)
					})
					.catch(err => {

					})
			},
			addPost(vuexContext, postData) {

				const createdPost = {
					...postData,
					updatedDate: new Date()
				};

				return axios
					.post("https://nuxt-blog-d461c.firebaseio.com/posts.json?auth=" + vuexContext.state.token, createdPost)
					.then(result => {
						vuexContext.commit('addPost', {
							...createdPost,
							id: result.data.name
						});
					})
					.catch(err => {
						console.error(err);
					});
			},
			editPost(vuexContext, editedPost) {
				return axios.put("https://nuxt-blog-d461c.firebaseio.com/posts/" + editedPost.id + ".json?auth=" + vuexContext.state.token, editedPost)
					.then(res => {
						vuexContext.commit('editPost', editedPost)
					})
					.catch(err => {

					})
			},
			setPosts(context, posts) {
				context.commit('setPosts', posts)
			},
			authenticateUser(vuexContext, authData) {
				let authUrl =
					"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
					process.env.fbAPIKey;
				if (!authData.isLogin) {
					authUrl =
						"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
						process.env.fbAPIKey;
				}

				return axios
					.post(authUrl, {
						email: authData.email,
						password: authData.password,
						returnSecureToken: true
					})
					.then(res => {
						vuexContext.commit('setToken', res.data.idToken);
						localStorage.setItem('token', res.data.idToken);
						localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(res.data.expiresIn) * 1000);

						Cookie.set('jwt', res.data.idToken);
						Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(res.data.expiresIn) * 1000)

						console.log(res);
					})
					.catch(err => {
						console.error(err);
					});
			},
			initAuth(vuexContext, req) {
				let token;
				let expirationDate;
				if(req) {
					if(!req.headers.cookie) {
						return; 
					}
					const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='));
					if(!jwtCookie) {
						return;
					}
					token = jwtCookie.split('=')[1];
					expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate='))
					.split("=")[1];
				} else {
					token = localStorage.getItem('token');
					expirationDate = localStorage.getItem('tokenExpiration');
				}

				if (new Date() > +expirationDate || !token) {
					console.log("No token or invalid token");
					//If token has expired
					vuexContext.dispatch('logout');					
					return;
				}

				//+ to convert to number
				
				vuexContext.commit('setToken', token)
			},
			logout(vuexContext) {
				vuexContext.commit("clearToken");
				Cookie.remove('jwt');
				Cookie.remove('expirationDate');

				if(process.client) {
					localStorage.removeItem('token');
					localStorage.removeItem('tokenExpiration');
				}
			}
		},
		getters: {
			loadedPosts(state) {
				return state.loadedPosts;
			},
			isAuthenticated(state) {
				return state.token !== null
			}
		}
	})
}

export default createStore;