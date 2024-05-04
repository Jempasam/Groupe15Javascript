import { Puissance4 } from "./field/Puissance4.mjs"
import { BASE_SPAWNABLE, BASE_MODIFIERS, BASE_COLLECTION } from "./field/collection/base_collection.mjs"
import { GameMenu } from "../../samlib/gui/GameMenu.mjs"
import { adom, create } from "../../samlib/DOM.mjs"
import { Loader } from "./editor/Loader.mjs"
import { GameHeader } from "../../samlib/gui/GameHeader.mjs"
import { Shop, ShopData } from "../../samlib/gui/Shop.mjs"
import { ACCOUNT_STORAGE, Storage } from "../../samlib/Storage.mjs"
import { SnakeItem } from "./items/SnakeItem.mjs"
import { FruitItem } from "./items/FruitItem.mjs"
import { EndScreen } from "../../samlib/gui/EndScreen.mjs"
import { RED_CONTROLER } from "./items/controler/Controlers.mjs"
import { MasterhandItem } from "./items/MasterhandItem.mjs"
import { Editor } from "./editor/Editor.mjs"
import { ItemCollection, ItemField } from "./field/field/ItemField.mjs"
import { achievement_registry } from "../../site/js/achievement_list.mjs"
import { ObserverGroup, ObserverKey } from "../../samlib/observers/ObserverGroup.mjs"


export class Puissance4Game{

    /** @type {ObserverGroup<Puissance4Game,{previous:number, actual:number, gained:number}>} */
    on_get_money=new ObserverGroup(this)

    /**
     * When a game start
     * @type {(field:Puissance4)=>void}
     */
    on_start_game=()=>{}

    /**
     * When a shop is opened
     * @type {(shop:Shop)=>void}
     */
    on_shop_opened=()=>{}

    /**
     * @param {HTMLElement} host
     * @param {Storage} used_storage
     */
    constructor(host, used_storage=ACCOUNT_STORAGE){
        this.host=host
        this.used_storage=used_storage

        // Header and content
        this.header=new GameHeader()
        this.host.innerHTML=""
        host.appendChild(this.header)
        host.appendChild(create("div"))
        this.openMenu()
    }

    #setMenu(menu, onback, onhome){
        let removed=this.host.lastChild
        if(removed) this.host.removeChild(removed)
        this.host.appendChild(menu)
        this.header.onback=onback
        this.header.onhome=onhome
    }

    openMenu(){
        let menu=new GameMenu()
        menu.title="Puissance 4"
        menu.onplay= ()=> this.openLoader()
        menu.onshop= ()=> this.openShop()
        menu.actions={
            "Editeur": ()=> this.openEditor(),
            "Test": ()=> this.test(),
            "Reset": ()=>{
                let shopdata=ShopData.get(this.used_storage,"test")
                shopdata.money=100
                shopdata.buyeds.clear()
                achievement_registry.clearGame("puissance4")
                ShopData.set(shopdata)
            },
            "Cheat": ()=>{
                let shopdata=ShopData.get(this.used_storage,"test")
                shopdata.money=100000
                for(let a in BASE_SPAWNABLE)shopdata.buyeds.add(a)
                ShopData.set(shopdata)
            },
            "Aide": ()=> this.helpScreen(),
        }

        this.#setMenu(menu, ()=>undefined, ()=>undefined)
    }

    openEditor(){
        let editor=new Editor()
        editor.storage=this.used_storage

        /** @type {import("./editor/Editor.mjs").ItemSpawnableDict} */
        let disponible={}
        for(let [key,spawnable] of Object.entries(BASE_SPAWNABLE)){
            if(ShopData.get(this.used_storage,"test").isBuyed(key))disponible[key]=spawnable
        }
        editor.collection=new ItemCollection(
            disponible,
            BASE_MODIFIERS
        )

        this.#setMenu(editor, ()=>this.openMenu(), ()=>this.openMenu())
    }

    openLoader(){
        let loader=new Loader()
        loader.storage=this.used_storage

        loader.collection=BASE_COLLECTION
        loader.onstart= field => this.play(field)

        this.#setMenu(loader, ()=>this.openMenu(), ()=>this.openMenu())
    }


    endGame(winner,score,money,field){
        let endScreen=new EndScreen()

        endScreen.money=money
        endScreen.score=score
        endScreen.winner=winner
        endScreen.actions={
            "Recommencer":()=>{this.play(field)},
            "Quitter":()=>{this.openMenu()}
        }

        this.#setMenu(endScreen, ()=>undefined, ()=>this.openMenu())
    }

    helpScreen(){
        let help=adom/*html*/`
            <div class="help">
                <h1>Help</h1>
                <h2>Introduction</h2>
                <p>Un <em>super puissance 4 génial</em>! Il n'y a pas de but, définissez vous même la condition de victoire.</p>
                <h2>Contrôles</h2>
                    <p>Respectivement pour gauche, tirer, droite:</p>
                    <ol>
                        <li><em>Rouge</em>: A Z E</li>
                        <li><em>Bleu</em>: U I O</li>
                        <li><em>Jaune</em>: R T Y</li>
                        <li><em>Vert</em>: V B N</li>
                    </ol>
                    <p>
                        Après avoir tiré, un joueur doit attendre que son canon se <em>recharge</em>.
                        Lorsqu'un joueur se déplace vers l'emplacement d'un autre joueur, les deux joueurs échangent leur place. Pour empêcher
                        les abus, un joueur ne peut initier ce genre d'échange que si son canon est chargé.
                    </p>
                    <p><em>Snake/Link/Pacman neutre</em>: flèches directionelles</p>
                    <p><em>Sanke/Link/Pacman colorés</em>: Les mêmes contrôles que les joueurs.</p>
                <h2>Magasin</h2>
                <p>
                    Vous pouvez acheter des objets au magasin pour pouvoir les utiliser dans l'éditeur
                    Pour cela il vous faut des <em>pièces</em> que vous gagnez en faisant des parties.
                </p>
                <h2>Editeur</h2>
                <p>Vous pouvez créer vos <em>propres niveaux</em> dans l'éditeur. Vous pouvez placer des objets et des modificateurs pour créer des niveaux uniques</p>
                <h2>Variantes</h2>
                <p>
                    Il existe plusieurs <em>variantes</em> d'objet. Des variantes des canons pour chaque équipe par exemple.
                    Pour <em>choisir la variante</em> utilisez l'entrée numérique au dessus de la petite fenêtre d'exemple en bas du panneau gauche de l'éditeur.
                </p>
            </div>
        `
        this.#setMenu(help, ()=>this.openMenu(), ()=>this.openMenu())
    }

    openShop(){
        let shop=new Shop(id=>{
            let ret=create(`div.presentation[title=${BASE_SPAWNABLE[id].name}]`)
            let field=new Puissance4()
            field.width=1
            field.height=1
            field.set(0,0,BASE_SPAWNABLE[id].factory(1))
            ret.appendChild(field)

            field=new Puissance4()
            field.width=1
            field.height=1
            field.set(0,0,BASE_SPAWNABLE[id].factory(0))
            ret.appendChild(field)
            return ret
        })
        shop.storage=this.used_storage
        shop.title="Magasin"
        shop.shop_content=BASE_SPAWNABLE
        shop.shop_id="puissance4"
        this.on_shop_opened(shop)
        this.#setMenu(shop, ()=>this.openMenu(), ()=>this.openMenu())

    }

    playGame(onback, callback){
        let game=new Puissance4()
        game.className="_scrollable"

        let stopper= {val:true}
        callback(game)
        this.on_start_game(game)
        setTimeout(function ticker(){
            game.ticks.tick(game)
            if(stopper.val)setTimeout(ticker,50)
        },50)

        this.#setMenu(game, ()=>{stopper.val=false; onback()}, ()=>{stopper.val=false; this.openMenu()})
    }

    /**
     * 
     * @param {ItemField} field 
     */
    play(field){
        this.playGame(
            ()=>this.openLoader(),
            game=>{
                game.width=field.content.width
                game.height=field.content.height
                field.write_field(game)
            }
        )
    }

    test(){
        this.playGame(
            ()=>this.openMenu(),
            game=>{
                game.width=10
                game.height=10
                game.set(5,0,new SnakeItem(new FruitItem(),0,1,RED_CONTROLER))
                game.set(7,7,new FruitItem())
                game.set(7,8,new FruitItem())
                game.set(7,9,new FruitItem())
                game.set(2,5,new FruitItem())
                game.set(1,5,new FruitItem())
                game.set(5,5,new MasterhandItem(3,1))
            }
        )
    }

    /**
     * @param {(data:ShopData)=>void} callback
     */
    editShopData(callback){
        const data=ShopData.get(this.used_storage, "puissance4")
        callback(data)
        ShopData.set(data)
    }

    /**
     * @param {number} money 
     */
    giveMoney(money){
        this.editShopData(data=>data.money+=money)
    }

}

