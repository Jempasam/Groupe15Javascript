export default class Serpent {
    constructor()
    {
        this.x = 50;
        this.y = 50;
        this.nbFruits = 0;
        this.segments = [];

    }

    move(posX, posY) {

        this.positionQueue();
        this.x += posX;
        this.y += posY;
    }


    positionQueue()
    {
        // Ajouter la nouvelle position en tant que premier segment
            this.segments.unshift({ x: this.x, y: this.y });
    
        // Supprimer les anciennes coordonnées si la longueur des segments dépasse nbFruits * 10
        while (this.segments.length > this.nbFruits) {
            this.segments.pop();
        }
    }

    getPositionX()
    {
        return this.x;
    }
    getPositionY()
    {
        return this.y;
    }

    getNbFruits()
    {
        return this.nbFruits;
    }

    setPositionX(TpX)
    {
        this.x = TpX;
    }

    setPositionY(TpY)
    {
        this.y = TpY;
    }

    AddNbFruits()
    {
        this.nbFruits ++;
    }    

    drawSerpent(ctx, zoom, angle) {
        ctx.save();  
    
        // Déplacement du serpent à la position (x, y)
        ctx.translate(this.x, this.y);
    
        // Zoom du serpent
        ctx.scale(zoom, zoom);
    
        // Rotation de la tête du serpent
        ctx.rotate(angle);
    
        // On dessine la tête du serpent en 0, 0
        ctx.fillStyle = 'black';
        ctx.fillRect(0, -25, 50, 50);
  
        ctx.fillStyle = 'red';
        ctx.fillRect(50, -5, 15,10)
        
        ctx.fillStyle = 'yellow';
        ctx.fillRect(25, -15, 10,10)
          
        ctx.restore();
    }
    
    drawGrossir(ctx, zoom, angle) {

        for (let i = 0; i < this.nbFruits; i++) {
            if (i <= this.nbFruits)
            {
                ctx.save();
                 ctx.translate(this.segments[i].x, this.segments[i].y);
                 ctx.scale(zoom, zoom);
                 ctx.rotate(angle);
                 ctx.fillStyle = '#F5F5DC';
                 ctx.fillRect(-25, -25, 50, 50);
                 ctx.restore();

            }
        }
    }
    

}
