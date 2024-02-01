export default class Serpent {
    constructor()
    {
        this.x = 50;
        this.y = 50;
        this.nbFruits = 0;
        this.segments = [];

    }

    move(posX, posY) {
        // Ajouter la nouvelle position en tant que premier segment
        this.segments.unshift({ x: this.x, y: this.y });
    
        // Supprimer les anciennes coordonnées si la longueur des segments dépasse nbFruits * 10
        while (this.segments.length > this.nbFruits * 1) {
            this.segments.pop();
        }
    
        this.x += posX;
        this.y += posY;
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

    drawSerpent(ctx, zoom, angle)
    {
        ctx.save();  

        // Déplacement du serpent à la position (x, y)
        ctx.translate(this.x, this.y);

        // Zoom du serpent
        ctx.scale(zoom, zoom);

        ctx.rotate(angle);

        // On dessine le serpent en 0, 0
        ctx.fillStyle = 'red';
        ctx.fillRect(0, -25, 75, 50);
  
        ctx.restore();
    }

    // On le fait grossir en fonction de la taille du serpent

    drawGrossir(ctx, zoom, angle) {
        for (let i = 0; i < this.nbFruits * 1; i++) {
            let segment = this.segments[i];
            ctx.save();
            ctx.translate(segment.x, segment.y);
            ctx.scale(zoom, zoom);
            ctx.rotate(angle);
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, -25, 55, 50);
            ctx.restore();
        }
    }

}
