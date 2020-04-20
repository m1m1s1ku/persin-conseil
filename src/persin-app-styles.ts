import { html } from 'lit-element';

const PERSIN_GREEN = '#42BB74';
const PERSIN_DARK_GREEN = '#278e51';

const parallaxPath = `assets/parallax/`;

const styles = html`
  <style>
    .home.jpg, .home.webp { min-height: 200px; }

    .home.webp { background-image: url('${parallaxPath}intro-bg.webp') }
    .home.jpg { background-image: url('${parallaxPath}intro-bg.jpg') }

    .section.text-content.conseil h2, .section.text-content.formation h2 { color: white; }
    .conseil.jpg { background-image: url('${parallaxPath}conseil.jpg') }
    .conseil.webp { background-image: url('${parallaxPath}conseil.webp')}

    .formation.jpg { background-image: url('${parallaxPath}formation.jpg');}
    .formation.webp { background-image: url('${parallaxPath}formation.webp');}

    .contact.webp { background-image: url('${parallaxPath}contact.webp');}
    .contact.jpg { background-image: url('${parallaxPath}contact.jpg');}

    /* 
      Generics 
    */
    mwc-textfield, mwc-textarea, mwc-button { --mdc-theme-primary: ${PERSIN_GREEN}}
    mwc-dialog { overflow-y: scroll }
    picture {pointer-events: none }
    section { position: relative; width: 100%; height: 100% }
    .app {
      text-align: center;
      font-family: 'IBM Plex Sans', sans-serif;
      overflow: hidden;
    }

    .app-header {
      position: fixed;
      width: 100%;
      z-index: 999;
      background-color: ${PERSIN_GREEN};
      color: white;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.1);
    }

    .app-header {
      user-select: none;
    }

    .app-header h1 {
      color: black;
      font-size: 1.1em;
      font-weight: bold;
      cursor: pointer;
      outline: none;
      text-transform: uppercase;
      padding: 0 40px;
      margin: 0;
      margin-top: 2px;
      font-family: 'PT Sans', sans-serif;
    }

    /*
      Menu 
    */
    .app-header .menu.desktop-menu { display: none; height: 100%; }
    .app-header .menu.mobile-menu { display: block; margin: 1em; }
    .app-header .menu.mobile-menu > mwc-icon-button { color: black; }
    .app-header .desktop-menu nav { padding-right: 30px }

    .app-header .desktop-menu nav ul {
      margin: 0;
      height: 100%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }

    .app-header .desktop-menu nav ul li {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      list-style: none;
      transition: background-color .3s;
      cursor: pointer;
    }

    .app-header .desktop-menu nav ul li a {
      color: white;
      padding: 0 10px;
      outline: none;
      text-decoration: none;
    }

    .app-header .desktop-menu nav ul li:hover, .app-header nav ul li.active {
      background-color: ${PERSIN_DARK_GREEN};
    }

    .app-header .mobile-popover {
      display: block;
      position: absolute;
      width: 100%;
      right: 0;
      transition:visibility 0.3s linear, opacity 0.3s linear;
      top: 50px;
    }

    .mobile-popover.hidden {
      opacity: 0;
      pointer-events: none;
    }
    .mobile-popover.visible {
      opacity: 1;
    }

    .app-header .mobile-popover nav ul li {
      list-style: none;
      padding: .5em;
    }

    .app-header .mobile-popover nav ul li a {
      color: white;
      text-decoration: none;
      outline: none;
    }

    .app-header .mobile-popover nav ul {
      background-color: rgba(66, 187, 116, .9);
      margin: 0;
      padding: .5em;
    }

    /* 
      Effects 
    */
    .parallax {
      background-size: cover;
      background-position: center center;
    }
    
    /* 
      Site header 
    */
    .header { padding-top: 40px; user-select: none; }

    .header h3 {
      font-size: 2em;
      padding-top: 2em;
    }

    .header p { padding-top: .3em }

    .header h3, .header p {
      margin: 0;
      color: white;
      text-shadow: 2px 2px 3px rgba(0,0,0,.6);
    }

    .text-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5em;
      font-size: 1.2em;
    }

    .section.text-content h2 {
      align-self: flex-start;
      color: ${PERSIN_DARK_GREEN}
    }

    .section.text-content.white p {
      color: white;
    }
    
    .text-content.no-background {
      background-color: white;
    }

    .text-content p, 
    .text-content h3 { text-align: justify }

    /* 
      Contact 
    */
    .contact.grid {
      padding: 5em;
      display: flex;
      flex-wrap: wrap;
    }

    .contact.grid > div {
      display: flex;
      flex-direction: column;
      color: white;
      justify-content: center;
      font-size: 1.2em;
      flex: 1 0 5em;
    }

    .contact.grid > div a {
      text-decoration: none;
      color: white;
      transition: color .3s;
    }

    .contact.grid > div a:hover { color: #CCC }

    .contact.grid .logotype {
      display: flex;
      align-items: center;
      align-self: center;
      user-select: none;
      margin: 2.5em;
    }

    .contact.grid .logotype h4 { margin-left: 10px }

    .contact.grid mwc-textfield, 
    .contact.grid mwc-textarea,  
    .contact.grid mwc-button {
      background-color: rgba(255, 255, 255, .8);
      text-align: left;
      padding: .5em;
      border-radius: 2px;
    }
    
    .contact.grid mwc-button {
      margin-top: 1em;
      color: black;
      align-self: flex-end;
    }

    .contact.grid mwc-button[disabled] { color: grey }

    .contact.grid .contact-form {
      display: flex;
      flex-direction: column;
      margin: 2em 0;
    }

    .contact.grid .contact-form:after {
      content: 'Le mail a été envoyé avec succès !';
      opacity: 0;
      transition: opacity .3s;
      position: absolute;
      color: black;
      display: flex;
      align-self: center;
      margin-top: 100px;
    }

    .contact.grid .contact-form.sended:after {
      opacity: 1;
    }

    .contact-infos > div {
      margin: 1.5em 0;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .contact-infos > div > mwc-icon {
      margin: 0 .2em;
    }
    /* 
      Footer 
    */
    footer {
      height: 125px;
    }

    footer.grid {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
    }

    footer.grid > div {
      display: flex;
      align-items: center;
    }

    footer.grid > div.copyright, 
    footer.grid > div.copyright a {
      user-select: none;
      color: black;
      text-decoration: none;
    }

    footer.grid > div.copyright span {
      margin: 0 2px;
    }

    footer.grid > div.social-container {
      justify-content: center;
    }
    
    footer.grid a {
      margin: 0 .5em;
      fill: white;
      height: 24px;
      width: 24px;
      transition: fill .3s;
    }

    footer.grid a:hover {
      fill: #CCC;
    }

    .legal-dialog {
      --mdc-dialog-min-width: 90vw;
      position: fixed;
      margin-top: 80px;
      z-index: 999;
    }

    footer.grid .mentions { cursor: pointer; margin: 0 }

    /* 
      Helpers 
    */
    .with-picture {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .start { align-self: flex-start; }
    .retreat { max-width: 30em; }
    .with-picture .full-width { display: block; padding: 0;}
    .full-width {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    .pad-thin { padding: .5em }

    @media (max-width: 400px){
      .contact.grid .logotype { margin: 0}
      .text-content { display: block }
    }

    @media (min-width: 400px){ 
      footer.grid { flex-direction: row } 
      .with-picture .full-width { padding: 0 2.5em;} 
    }

    @media(min-width: 700px){
      .with-picture { flex-direction: row }
      .app-header .menu.desktop-menu { display: flex }
      .app-header .menu.mobile-menu { display: none }
      .app-header .mobile-popover { pointer-events: none }
    }

    @supports (-webkit-overflow-scrolling: touch) {
      .parallax {
        background-attachment: auto;
      }
    }

    @supports not (-webkit-overflow-scrolling: touch) {
      .parallax {
        background-attachment: fixed;
      }
    }
  </style>
` as any;

export default styles;