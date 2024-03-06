export default class Fruit {
    constructor()
    {
        this.x = 100;
        this.y = 100;
        this.nbFruitsSpawn = 0;
        this.images = new Image();
        this.images = '../assets/fruit1.png';
    }

    move(posX, posY)
    {
        this.x += posX;
        this.y += posY
    }

    getPositionX()
    {
        return this.x;
    }
    getPositionY()
    {
        return this.y;
    }

    getnbFruitSpawn()
    {
        return this.nbFruitsSpawn;
    }

    setPositionX(TpX)
    {
        this.x = TpX;
    }

    setPositionY(TpY)
    {
        this.y = TpY;
    }

    drawFruit(ctx, zoom) 
    {
        // Sauvegarde du contexte
        ctx.save();
        
        // On dessine le fruit (ajoutez votre code ici)
        
        ctx.translate(this.x, this.y);
        ctx.scale(zoom, zoom);
        ctx.rotate(0);
      
        // On dessine le fruit en 0, 0
        
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, -40); // Point de départ
        ctx.lineTo(0, -23); // Point d'arrivée
        ctx.strokeStyle = 'rgb(100, 200, 100)'; // Couleur du trait
        ctx.lineWidth = 5; // Épaisseur du trait
        ctx.stroke(); // Dessin du trait
      
        // Restauration du contexte
        ctx.restore();
        this.nbFruitsSpawn ++;
      }

    
}
