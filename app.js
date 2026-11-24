import { auth, db } from "./config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const authScreen = document.getElementById("auth-screen");
const chatScreen = document.getElementById("chat-screen");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const authError = document.getElementById("auth-error");
const userBadge = document.getElementById("user-badge");
const messagesList = document.getElementById("messages-list");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let unsubscribeMessages = null;

function showError(msg) {
  authError.textContent = msg;
}

loginBtn.addEventListener("click", async () => {
  showError("");
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    showError("تعذر تسجيل الدخول، تأكد من البريد وكلمة المرور.");
  }
});

signupBtn.addEventListener("click", async () => {
  showError("");
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    showError("تعذر إنشاء الحساب، تأكد أن كلمة المرور 6 أحرف أو أكثر.");
  }
});

logoutBtn.addEventListener("click", async () => {
  if (unsubscribeMessages) {
    unsubscribeMessages();
    unsubscribeMessages = null;
  }
  await signOut(auth);
});

function listenToMessages(currentUserEmail) {
  const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
  unsubscribeMessages = onSnapshot(q, (snapshot) => {
    messagesList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const item = document.createElement("div");
      const isMine = data.sender === currentUserEmail;
      item.className = isMine ? "message-item mine" : "message-item theirs";

      const senderEl = document.createElement("div");
      senderEl.className = "message-sender";
      senderEl.textContent = data.sender || "مستخدم";

      const textEl = document.createElement("div");
      textEl.className = "message-text";
      textEl.textContent = data.text || "";

      item.appendChild(senderEl);
      item.appendChild(textEl);
      messagesList.appendChild(item);
    });
    messagesList.scrollTop = messagesList.scrollHeight;
  });
}

messageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  const text = messageInput.value.trim();
  if (!user || !text) return;

  messageInput.value = "";
  await addDoc(collection(db, "messages"), {
    text,
    sender: user.email,
    uid: user.uid,
    createdAt: serverTimestamp()
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    authScreen.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    userBadge.textContent = user.email;
    listenToMessages(user.email);
  } else {
    if (unsubscribeMessages) {
      unsubscribeMessages();
      unsubscribeMessages = null;
    }
    chatScreen.classList.add("hidden");
    authScreen.classList.remove("hidden");
  }
});
                                            
