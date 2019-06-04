class BitmapCache extends BitmapData {
    constructor(target, renderStackElement = null) {
        super(1, 1);
        this.needsUpdate = false;
        this.target = target;
        this.renderStackElement = renderStackElement;
    }
    draw(context, offsetW, offsetH) {
        const target = this.target;
        context.save();
        if (!this.renderStackElement)
            context.globalAlpha = target.realAlpha;
        context.scale(1 / (this.width - offsetW * 2), 1 / (this.height - offsetH * 2));
        context.translate(-offsetW, -offsetH);
        context.drawImage(this.canvas, 0, 0);
        context.restore();
    }
    /*
  FillStroke / FilterStack / renderStack :
   => ajout de propriété
     public cacheAsBitmap => indique qu'il faut créer un cache au niveau du Display2D quand on génére le rendu
     protected sharedCacheAsBitmap et une fonction setSharedBitmapCache(target:Display2D)
            ###> un cache doit avoir des dimension et nécessite donc un Display2D
  
            sharedCacheAsBitmap permet d'affecter un cache directement à l'objet FillStroke / FilterStack / renderStack
             => il sera donc utilisé lors du rendu de chaque Display2D qui l'utilise sans créer de cache au niveau du display2D;
  
            par exemple si je crée une renderStack et que j'appelle setSharedBitmapCache avec un Display2D qui fait 100x100
  
            si je transmet ce renderStack vers un Display2D de 400x400, sa qualité sera détérioré car son cache ne sera que de 100x100
  
    faire en sore que chaque FillStroke / FilterStack / renderStack ai un id unique
    |-> cet id fera la liaison entre le Display2D et le cache associé
  
    deplacer les fonction update/updateBounds/updateCache de RenderStack
    pour les mettre dans Display2D
    |-> cela permet de gérer tout les cachesAsBitmap au niveau de Display2D et d'assurer le partage de RenderStack
        |=> L'objet renderStack & renderStackElement peuvent être defini comme cacheAsBitmap
           ||==> quand le renderStack est associé a un Display2D, les cachesAsBitmap sont appliqué sur le Display2D
  
  
  
  
  
    ||=> pour customiser un FillStroke / filter issu d'un renderStack partagé, il faut le cloner
  
  
    TODO :
       mettre une propriété cacheAsBitmap sur RenderStack;
       |-> Display2D.cacheAsBitmap pointe sur RenderStack.cacheAsBitmap (?)
  
  
                |-> on garde en mémoire les dimension & scale du premier Display2D a recevoir le cacheAsBitmap
                    ==> si le display2D target a les meme dimension/scale, on pointe vers le bitmapData du cacheAsBitmap source
                        sinon, on applique le cacheAsBitmap sur le display2D
  
  
  
    */
    updateCache(forceUpdate = false) {
        if (this.needsUpdate == true || forceUpdate) {
            //console.log("updateCache")
            const w = this.target.width * this.target.scaleX;
            const h = this.target.height * this.target.scaleY;
            const context = this.context;
            const target = this.target;
            if (this.renderStackElement) {
                if (this.renderStackElement.value instanceof FillStroke) {
                    const o = this.renderStackElement.value;
                    this.width = w + o.offsetW * 2;
                    this.height = h + o.offsetH * 2;
                    context.save();
                    var m = new DOMMatrix().translate(o.offsetW, o.offsetH).scale(w, h);
                    context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                    o.apply(context, this.renderStackElement.lastPath, target);
                    this.context.restore();
                }
            }
            else {
                const renderStack = target.renderStack;
                renderStack.updateBounds(target);
                this.width = w + renderStack.offsetW * 2;
                this.height = h + renderStack.offsetH * 2;
                context.save();
                var m = new DOMMatrix().translate(renderStack.offsetW, renderStack.offsetH).scale(w, h);
                context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
                let o;
                let path;
                let text;
                let elements = target.renderStack.elements;
                let i, nb = target.renderStack.elements.length;
                for (i = 0; i < nb; i++) {
                    o = target.renderStack.elements[i];
                    context.save();
                    if (o.enabled) {
                        if (o.isShape)
                            o.value.apply(context, target);
                        else {
                            if (o.isPath)
                                path = o.value;
                            else if (o.isTextPath)
                                text = o.value;
                            else {
                                if (o.isTextFillStroke)
                                    o.value.apply(context, text, target);
                                else
                                    o.value.apply(context, path, target);
                            }
                        }
                    }
                    context.restore();
                }
                context.restore();
            }
            this.needsUpdate = false;
        }
    }
}
//# sourceMappingURL=BitmapCache.js.map