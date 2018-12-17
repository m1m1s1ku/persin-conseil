import { html } from '@polymer/lit-element';

const PERSIN_GREEN = '#42BB74';
const PERSIN_DARK_GREEN = '#39AB68';

const parallaxPath = `assets/parallax/`;

const styles = html`
  <style>
    .home.jpg, .home.webp { min-height: 200px; }
    .home.webp { background-image: url('${parallaxPath}intro-bg.webp') }
    .home.jpg { background-image: url('${parallaxPath}intro-bg.jpg') }
    .conseil.jpg { background-image: url('${parallaxPath}conseil.jpg') }
    .conseil.webp { background-image: url('${parallaxPath}conseil.webp')}
    .formation.jpg { background-image: url('${parallaxPath}formation.jpg');}
    .formation.webp { background-image: url('${parallaxPath}formation.webp');}
    .contact.webp { background-image: url('${parallaxPath}contact.webp');}
    .contact.jpg { background-image: url('${parallaxPath}contact.jpg');}

    /* 
      Generics 
    */
    paper-input, paper-textarea { --paper-input-container-focus-color: ${PERSIN_GREEN}}
    paper-dialog { overflow-y: scroll }
    picture {pointer-events: none }
    
    .app {
      text-align: center;
      font-family: sans-serif;
      font-family: 'IBM Plex Sans', sans-serif;
    }

    .app-header {
      position: fixed;
      width: 100%;
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
    .app-header .menu.desktop-menu { display: none }
    .app-header .menu.mobile-menu { display: block; margin: 1em; }
    .app-header .desktop-menu nav { padding-right: 30px }

    .app-header .desktop-menu nav ul {
      margin: 0;
      padding: 0;
    }

    .app-header .desktop-menu nav ul li {
      display: inline-block;
      padding: 15px 0;
      list-style: none;
      transition: background-color .3s;
    }

    .app-header .desktop-menu nav ul li a {
      color: white;
      padding: 0 10px;
      text-decoration: none;
    }

    .app-header .desktop-menu nav ul li a iron-icon {
      margin-top: -6px;
    }

    .app-header .desktop-menu nav ul li:hover, .app-header nav ul li.active {
      background-color: ${PERSIN_DARK_GREEN};
    }

    .app-header .mobile-popover {
      display: block;
      position: absolute;
      margin-top: 85px;
      right: 0;
    }

    .app-header .mobile-popover nav ul li {
      list-style: none;
    }

    .app-header .mobile-popover nav ul li a {
      color: white;
      text-decoration: none;
    }

    .app-header .mobile-popover nav ul {
      background-color: ${PERSIN_GREEN};
      margin: 0;
      padding: .5em;
    }

    /* 
      Effects 
    */
    .parallax {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
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
      color: ${PERSIN_GREEN}
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

    .contact.grid paper-input, 
    .contact.grid paper-textarea,  
    .contact.grid paper-button {
      background-color: rgba(255, 255, 255, .8);
      text-align: left;
      padding: .5em;
      border-radius: 2px;
    }
    
    .contact.grid paper-button {
      margin-top: 1em;
      color: black;
      align-self: flex-end;
    }

    .contact.grid paper-button[disabled] { color: grey }

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
      color: white;
      text-decoration: none;
    }

    footer.grid > div.copyright span {
      margin: 0 2px;
    }

    footer.grid > div.social-container {
      justify-content: center;
    }

    footer iron-icon.social {
      color: white;
      margin: 0 .5em;
    }

    .mentions { cursor: pointer; }

    /* 
      Helpers 
    */
    .with-picture {
        display: flex;
        align-items: center;
        flex-direction: column;
    }
    .with-picture > div { margin: .5em }
    .start { align-self: flex-start; }
    .retreat { max-width: 30em; }

    @media (max-width: 400px){
      .contact.grid .logotype { margin: 0}
      .text-content { display: block }
    }

    @media (min-width: 400px){ footer.grid { flex-direction: row } }

    @media(min-width: 700px){
      .with-picture { flex-direction: row }
      .app-header .menu.desktop-menu { display: flex }
      .app-header .menu.mobile-menu { display: none }
    }
  </style>
` as any;

export default styles;