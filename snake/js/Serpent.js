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

    drawSerpent(ctx, zoom, angle, skin) {
        ctx.save();  
    
        // Déplacement du serpent à la position (x, y)
        ctx.translate(this.x, this.y);
    
        // Zoom du serpent
        ctx.scale(zoom, zoom);
    
        // Rotation de la tête du serpent
        ctx.rotate(angle);

        if (skin == 0)
        {
            this.drawTeteSkinManchot(ctx);
        }
        else
        {
            this.drawTeteSkinCanard(ctx);
        }
    }

    drawTeteSkinManchot(ctx) 
    {
        // On dessine la tête du serpent en 0, 0
        ctx.fillStyle = 'black';
        ctx.fillRect(0, -25, 50, 50);
          
        ctx.fillStyle = 'red';
        ctx.fillRect(50, -5, 15,10)
                
        ctx.fillStyle = 'orange';
        ctx.fillRect(50, -5, 15,10)
                
        ctx.fillStyle = 'black';
        ctx.fillRect(50, -5, 15,4)
               
        ctx.fillStyle = '#CC7722';
        ctx.fillRect(25, -15, 10,10)
        ctx.restore();
    }

    drawTeteSkinCanard(ctx)
    {
        let gradient = ctx.createLinearGradient(0, -25, 50, 25);
        gradient.addColorStop(1, '#008080');
        gradient.addColorStop(0, " 	#303030");
        
        // Dessiner le carré avec le dégradé
        ctx.fillStyle = gradient;
        ctx.fillRect(0, -25, 50, 50);
         
        ctx.fillStyle = 'gold';
        ctx.fillRect(50, -6, 15,5)
      
        ctx.fillStyle = 'gold';
        ctx.fillRect(50, 4, 15,5)
      
        ctx.fillStyle = 'black';
        ctx.fillRect(25, -15, 10,10)
        
        ctx.restore();
    }


    
    drawGrossir(ctx, zoom, angle, skin) {

        for (let i = 0; i < this.nbFruits; i++) {
            if (i <= this.nbFruits)
            {
                ctx.save();
                 ctx.translate(this.segments[i].x, this.segments[i].y);
                 ctx.scale(zoom, zoom);
                 ctx.rotate(angle);

                 if (skin == 0)
                 {
                     this.drawCorpsSkinManchot(ctx);
                 }
                 else
                 {
                     this.drawCorpsSkinCanard(ctx);
                 }

            }
        }
    }

    drawCorpsSkinManchot(ctx)
    {
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(-25, -25, 50, 50);
        ctx.restore();
    }

    drawCorpsSkinCanard(ctx)
    {
        ctx.fillStyle = '#7B7878';
        ctx.fillRect(-25, -25, 50, 50);
        ctx.restore();
        
    }
    

}
