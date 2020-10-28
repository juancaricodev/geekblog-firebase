class Autenticacion {
  authEmailPass (email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        if(result.user.emailVerified) {
          $('#avatar').attr('src', 'imagenes/usuario_auth.png')
          Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000)
        } else {
          firebase.auth().signOut()
          Materialize.toast(`Por favor verificar la cuenta primero.`, 5000)
        }
      })

    $('.modal').modal('close')
  }

  crearCuentaEmailPass (email, password, nombres) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(result => {
        result.user.updateProfile({
          displayName : nombres
        })

        const configuration = {
          url : 'http://localhost:3000/'
        }

        result.user.sendEmailVerification(configuration)
        .catch(error => {
          console.error(error)
          Materialize.toast(error.message, 4000)
        })

        firebase.auth().signOut()

        Materialize.toast(
          `Bienvenido ${nombres}, debes realizar el proceso de verificación`,
          4000
        )

        $('.modal').modal('close')
      })
      .catch(error => {
        console.error(error)
        Materialize.toast(error.message, 4000)
      })
  }

  authCuentaGoogle () {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
      .then(result => {
        $('#avatar').attr('src', result.user.photoURL)
        $('.modal').modal('close')
        Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
      })
      .catch(error => {
        console.error(error)
        Materialize.toast(`Error al autenticarse con Google`, 4000)
      })
  }

  authCuentaFacebook () {
    //$('#avatar').attr('src', result.user.photoURL)
    //$('.modal').modal('close')
    //Materialize.toast(`Bienvenido ${result.user.displayName} !! `, 4000)
  }

  authTwitter () {
    // TODO: Crear auth con twitter
  }
}
