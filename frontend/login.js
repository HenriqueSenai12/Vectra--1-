// Login system with server API
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');

  // Toggle password visibility
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  // Login handler
  if (loginBtn && emailInput && passwordInput) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const senha = passwordInput.value.trim();

      if (!email || !senha) {
        alert('Preencha email e senha');
        return;
      }

      try {
        const usersResponse = await fetch('/api/users');
        const users = await usersResponse.json();
        const user = users.find(u => u.email === email);
        let data;
        if (user && user.senha === senha) {
          data = { success: true, user: { nome_completo: user.name, funcao: user.role } };
        } else {
          data = { success: false, error: 'Credenciais inválidas' };
        }

        if (data.success) {
          // Save user in localStorage for session
          localStorage.setItem('vectraUser', JSON.stringify(data.user));
          window.location.href = 'Tela principal/painel_principal.html';
        } else {
          alert(data.error || 'Erro no login');
        }
      } catch (err) {
        alert('Erro de conexão');
        console.error(err);
      }
    });
  }
});
