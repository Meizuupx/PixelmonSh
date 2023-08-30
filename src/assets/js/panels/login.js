/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

import { database, changePanel, addAccount, accountSelect } from '../utils.js';
const { Mojang } = require('minecraft-java-core');

class Login {
    static id = "login";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        this.loginOffline()
    }

    async loginOffline() {
        let mailInput = document.querySelector('.Mail')
        let cancelMojangBtn = document.querySelector('.cancel-login')
        let infoLogin = document.querySelector('.info-login')
        let loginBtn = document.querySelector(".login-btn")

        cancelMojangBtn.addEventListener("click", () => changePanel("settings"))

        loginBtn.addEventListener("click", async () => {
            cancelMojangBtn.disabled = true;
            loginBtn.disabled = true;
            mailInput.disabled = true;
            infoLogin.innerHTML = "Connexion en cours...";


            if (mailInput.value == "") {
                infoLogin.innerHTML = "Veuillez entrer le Nom d'utilisateur"
                cancelMojangBtn.disabled = false;
                loginBtn.disabled = false;
                mailInput.disabled = false;
                return
            }

            if (mailInput.value.length < 3) {
                infoLogin.innerHTML = "Votre nom d'utilisateur doit avoir au moins 3 caractères"
                cancelMojangBtn.disabled = false;
                loginBtn.disabled = false;
                mailInput.disabled = false;
                return
            }

            let account_connect = await Mojang.login(mailInput.value)


            let account = {
                access_token: account_connect.access_token,
                client_token: account_connect.client_token,
                uuid: account_connect.uuid,
                name: account_connect.name,
                user_properties: account_connect.user_properties,
                meta: {
                    type: account_connect.meta.type,
                    offline: account_connect.meta.online
                }
            }

            this.database.add(account, 'accounts')
            this.database.update({ uuid: "1234", selected: account.uuid }, 'accounts-selected');

            addAccount(account)
            accountSelect(account.uuid)
            changePanel("home");

            mailInput.value = "";
            loginBtn.disabled = false;
            mailInput.disabled = false;
            cancelMojangBtn.disabled = false;
            loginBtn.style.display = "block";
            infoLogin.innerHTML = "&nbsp;";
        })
    }
}

export default Login;