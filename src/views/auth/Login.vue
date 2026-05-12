<template>
  <div class="login-bg">
    <div class="overlay"></div>

    <div class="login-container ">
      <div class="login-card">

        <div class="icon-wrapper">
          <img src="/login-icon.svg" alt="Login Icon" />
        </div>

        <h2 class="title">KissMeet</h2>
        <p class="subtitle">Sign in to continue to your account</p>

        <form @submit.prevent="handleLogin" class="form">

          <div class="input-group">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="Enter your email" />
          </div>

          <div class="input-group">
            <label>Password</label>
            <input v-model="password" type="password" placeholder="Enter your password" />
          </div>

          <div class="row">
            <label class="remember">
              <input type="checkbox" v-model="remember" />
              <span class="check"></span>
              Remember me
            </label>

            <router-link to="/forgot-password" class="link">
              Forgot password?
            </router-link>
          </div>

          <button class="btn" :disabled="loading">
            <span v-if="!loading">Sign In</span>

            <span v-else class="spinner"></span>
          </button>

        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { login as loginRequest } from '../../services/api'
    import { useToast } from '../../composables/useToast'

    const { showToast } = useToast()
    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const remember = ref(false)
    const loading = ref(false)

    const handleLogin = async () => {
        loading.value = true

        try {
            const res = await loginRequest({
                email: email.value,
                password: password.value
            })

            localStorage.setItem('token', res.token)
            router.push('/')
        } catch (e) {
            showToast('Login failed: ' + e.message, 'error')
        } finally {
            loading.value = false
        }
    }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');

  .login-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    background: url('/images/travel-bg.jpg') center/cover no-repeat;
    position: relative;
    font-family: Poppins, sans-serif;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-container {
    width: 100%;
    max-width: 420px;
  }
  .login-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 40px 32px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
  }

  .icon-wrapper {
    width: 70px;
    height: 70px;
    margin: 0 auto 20px auto;
    border-radius: 18px;
    padding:8px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(135deg, #6a11cb, #2575fc);
    box-shadow: 0 10px 25px rgba(37,117,252,0.3);
  }

  .icon-wrapper img {
    width: 38px;
    height: 38px;
  }

  .title {
    text-align: center;
    font-size: 46px;
    font-weight: 400;
    color: #222;

    font-family: 'Chewy', cursive;

    letter-spacing: 1px;
  }

  .subtitle {
    text-align: center;
    font-size: 13px;
    color: #777;
    margin-bottom: 25px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .input-group label {
    font-size: 12px;
    color: #555;
    margin-bottom: 6px;
  }

  .input-group input {
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid #ddd;
    outline: none;

    transition: 0.3s;
  }

  .input-group input:focus {
    border-color: #6a11cb;
    box-shadow: 0 0 0 3px rgba(106,17,203,0.15);
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    margin-top: -6px;
  }

  .remember {
    display: flex;
    gap: 6px;
    color: #666;
  }

  .link {
    color: #6a11cb;
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }

  .btn {
    margin-top: 10px;
    padding: 12px;
    border-radius: 10px;
    border: none;
    cursor: pointer;

    color: white;
    font-weight: 600;

    background: linear-gradient(135deg, #6a11cb, #2575fc);
    box-shadow: 0 12px 25px rgba(37,117,252,0.25);

    transition: 0.3s;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn:active {
    transform: scale(0.98);
  }

  .footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
  }

  .strong {
    font-weight: 600;
  }

  @media (max-width: 480px) {

    .login-container {
      height: 100%;
      width: 100%;
      display: flex;
    }

    .login-card {
      width: 100%;
      height: calc(100vh - 32px);
      margin: 0 16px;
      border-radius: 20px;
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

  }

  .remember {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    user-select: none;
  }

  /* hide native checkbox */
  .remember input {
    display: none;
  }

  /* outer box */
  .check {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    border: 2px solid #d0d0d0;
    background: #fff;
    position: relative;
    transition: all 0.25s ease;
    flex-shrink: 0;
  }

  /* hover state */
  .remember:hover .check {
    border-color: #6a11cb;
    box-shadow: 0 0 0 3px rgba(106,17,203,0.08);
  }

  /* checked state */
  .remember input:checked + .check {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    border-color: transparent;
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(37,117,252,0.25);
  }

  /* animated tick */
  .remember input:checked + .check::after {
    content: "";
    position: absolute;
    left: 7px;
    top: 3px;

    width: 5px;
    height: 10px;

    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);

    animation: tick 0.2s ease-out;
  }

  /* tick animation */
  @keyframes tick {
    from {
      opacity: 0;
      transform: rotate(45deg) scale(0.6);
    }
    to {
      opacity: 1;
      transform: rotate(45deg) scale(1);
    }
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.8s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* optional UX improvement */
  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>