import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController,
  Alert,
  AlertController
} from 'ionic-angular';
import { ProfileProvider } from "../../providers/profile/profile";
import { AuthProvider } from "../../providers/auth/auth";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider
  ){
  }

  ionViewDidLoad() {
    this.profileProvider.getUserProfile().on("value", userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.birthDate = userProfileSnapshot.val().birthDate;
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: "Tu nombre y apellido",
      inputs: [
        {
          name: "firstName",
          placeholder: "Tu nombre",
          value: this.userProfile.firstName
        },
        {
          name: "lastName",
          placeholder: "Tu apellido",
          value: this.userProfile.lastName
        }
      ],
      buttons: [
        { text: "Cancelar" },
        {
          text: "Guardar",
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate:string): void {
    this.profileProvider.updateDOB(birthDate);
  }

  updateEmail():void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [{ name: 'newEmail', placeholder: 'Tu nuevo email' },
        { name: 'password', placeholder: 'Tu contraseña', type: 'password' }],
      buttons: [
        { text: 'Cancelar' },
        { text: 'Guardar',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => { console.log('Tu email ha sido cambiado exitosamente.'); })
              .catch(error => { console.log('ERROR: ' + error.message); });
          }}]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'Nueva contraseña', type: 'password' },
        { name: 'oldPassword', placeholder: 'Contraseña actual', type: 'password' }
      ],
      buttons: [
        { text: 'Cancelar' },
        { text: 'Guardar',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }
}
