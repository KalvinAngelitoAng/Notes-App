import api from '../../data/api';

export default class LoginPage {
    async render() {
        return `
      <section class="container">
        <h1>Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="button">Login</button>
        </form>
        <p>Don't have an account? <a href="#/register">Register here</a>.</p> 
      </section>
    `;
    }

    async afterRender() {
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = event.target.email.value;
            const password = event.target.password.value;

            const response = await api.login({ email, password });
            if (!response.error) {
                window.location.hash = '#/';
            } else {
                alert(`Error: ${response.message}`);
            }
        });
    }
}