importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.8/firebase-messaging.js');

firebase.initializeApp({
  projectId: 'geekblog-fdeca',
  messagingSenderId: '450090652585',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const tituloNotificacion = `Tenemos un nuevo post`;
  const opcionesNotificacion = {
    body: payload.data.titulo,
    icon: 'icons/icon_new_post.png',
    click_action: 'https://geekblog-fdeca.firebaseapp.com/',
  };

  return self.ServiceWorkerRegistration.showNotification(
    tituloNotificacion,
    opcionesNotificacion
  );
});
