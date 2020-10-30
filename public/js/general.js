$(() => {
  $('.tooltipped').tooltip({ delay: 50 })
  $('.modal').modal()

  // Adicionar el service worker
  navigator.serviceWorker
  .register('../notificaciones-sw')
  .then(registro => {
    console.log('service worker registrado')
    firebase.messaging().useServiceWorker(registro)
  })
  .catch(error => {
    console.error(`Error al registrar el service worker => ${error}`)
  })

  const messaging = firebase.messaging()

  // Registrar LLave publica de messaging
  messaging.usePublicVapidKey(
    'BFTkNne-MpDOpN2CcDUBFckOv3MJQxe-Vle6MnMp-2Txn6-Y3H5syYL4iZgTx5GJry_O8tXLNJdXNHiYpBqGjQM'
  )

  // Solicitar permisos para las notificaciones
  messaging.requestPermision()
  .then(() => {
    console.log('Permiso otorgado')
    return messaging.getToken()
  })
  .then(token => {
    const db = firebase.firestore()
    // db.settings({timestampsInSnapshots:true})
    db.collection('tokens')
      .doc(token)
      .set({
        token: token
      }).catch(error => {
        console.error(`Error al insertar el token en al BD => ${error}`)
      })
  })


  // TODO: Recibir las notificaciones cuando el usuario esta foreground

  // TODO: Recibir las notificaciones cuando el usuario esta background


  // Init Firebase nuevamente
  firebase.initializeApp(varConfig);

  // Listening real time
  const post = new Post()
  post.consultarTodosPost()

  // Firebase observador del cambio de estado
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $('#btnInicioSesion').text('Cerrar Sesión')

      user.photoURL
      ? $('#avatar').attr('src', user.photoURL)
      : $('#avatar').attr('src', 'imagenes/usuario_auth.png')
    } else {
      $('#btnInicioSesion').text('Iniciar Sesión')
      $('#avatar').attr('src', 'imagenes/usuario.png')
    }
  })

  // Evento boton inicio sesion
  $('#btnInicioSesion').click(() => {
    const user = firebase.auth().currentUser

    if (user) {
      $('#btnInicioSesion').text('Iniciar Sesión')

      return (
        firebase.auth().signOut()
          .then(() => {
            $('#avatar').attr('src', 'imagenes/usuario.png')
            Materialize.toast(`SignOut Correcto`, 4000)
          })
          .catch(error => {
            Materialize.toast(`Error al realizar SignOut => ${error}`, 4000)
          })
      )
    }


    $('#emailSesion').val('')
    $('#passwordSesion').val('')
    $('#modalSesion').modal('open')
  })

  $('#avatar').click(() => {
    firebase.auth().signOut()
      .then(() => {
        $('#avatar').attr('src', 'imagenes/usuario.png')
        Materialize.toast(`SignOut correcto`, 4000)
      })
      .catch(error => {
        Materialize.toast(`Error al realizar SignOut ${error}`, 4000)
      })
  })

  $('#btnTodoPost').click(() => {
    $('#tituloPost').text('Posts de la Comunidad')
    const post = new Post()
    post.consultarTodosPost()
  })

  $('#btnMisPost').click(() => {
    const user = firebase.auth().currentUser
    if (user) {
      const post = new Post()
      post.consultarPostxUsuario(user.email)
      $('#tituloPost').text('Mis Posts')
    } else {
      Materialize.toast(`Debes estar autenticado para ver tus posts`, 4000)
    }
  })
})
