
const form = document.getElementById("account-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const userInfo = document.getElementById("user-info");
const signupButton = document.getElementById("signup");
const logoutButton = document.getElementById("logout");

function showMessage(text) {
  message.textContent = text;
}

async function refreshAccount() {
  const { data, error } =
    await supabaseClient.auth.getUser();

  if (error) {
    showMessage("Kunde inte kontrollera kontot.");
    return;
  }

  const user = data.user;

  if (user) {
    userInfo.textContent = "Inloggad som: " + user.email;
    logoutButton.hidden = false;
    form.hidden = true;
  } else {
    userInfo.textContent = "";
    logoutButton.hidden = true;
    form.hidden = false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("Loggar in...");

  const { error } = await supabaseClient.auth
    .signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

  if (error) {
    showMessage("Inloggningen misslyckades: " + error.message);
    return;
  }

  showMessage("Du är inloggad!");
  await refreshAccount();
});

signupButton.addEventListener("click", async () => {
  showMessage("Skapar konto...");

  const { data, error } = await supabaseClient.auth
    .signUp({
      email: emailInput.value.trim(),
      password: passwordInput.value,
      options: {
        emailRedirectTo: window.location.origin + "/konto/"
      }
    });

  if (error) {
    showMessage("Kunde inte skapa kontot: " + error.message);
    return;
  }

  if (data.session) {
    showMessage("Kontot är skapat och du är inloggad!");
    await refreshAccount();
  } else {
    showMessage(
      "Kontot har skapats. Kontrollera din e-post för att bekräfta kontot."
    );
  }
});

logoutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showMessage("Kunde inte logga ut: " + error.message);
    return;
  }

  showMessage("Du har loggat ut.");
  await refreshAccount();
});

supabaseClient.auth.onAuthStateChange(() => {
  refreshAccount();
});

refreshAccount();
