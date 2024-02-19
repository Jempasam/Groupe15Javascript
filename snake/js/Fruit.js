export default class Fruit {
    constructor()
    {
        this.x = 100;
        this.y = 100;
        this.nbFruitsSpawn = 0;
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
        
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, 30, 40);
      
        // Restauration du contexte
        ctx.restore();
        this.nbFruitsSpawn ++;
      }

    
}
