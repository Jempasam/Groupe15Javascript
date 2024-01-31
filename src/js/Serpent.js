export default class Serpent {
    constructor()
    {
        this.x = 50;
        this.y = 50;
        this.nbFruits = 0;
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
        ctx.fillStyle = 'green';
        ctx.fillRect(-25, -25, 50, 50);
  
        ctx.restore();
    }

    drawGrossir(ctx, zoom, angle)
    {
        for (let i = 0 ; i < this.nbFruits; i++)
        {
            let grossirX = -50 * (i + 1);

            ctx.save();

            ctx.translate(this.x, this.y)
    
            ctx.scale(zoom,zoom);
    
            ctx.rotate(angle)
    
            ctx.fillStyle = 'blue';
            ctx.fillRect(grossirX,-25, 55, 50);
    
            ctx.restore();
        }

    }
}
