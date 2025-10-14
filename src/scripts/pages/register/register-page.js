import api from '../../data/api';

export default class RegisterPage {
    async render() {
        return `
      <section class="container">
        <h1>Register</h1>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" minlength="8" required>
          </div>
          <button type="submit" class="button">Register</button>
        </form>
        <p>Already have an account? <a href="#/login">Login here</a>.</p>
      </section>
    `;
    }

    async afterRender() {
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = event.target.name.value;
            const email = event.target.email.value;
            const password = event.target.password.value;

            try {
                const response = await api.register({ name, email, password });
                if (!response.error) {
                    alert('Registration successful! Please login.');
                    window.location.hash = '#/login';
                } else {
                    alert(`Registration failed: ${response.message}`);
                }
            } catch (error) {
                alert(`An error occurred: ${error.message}`);
            }
        });
    }
}