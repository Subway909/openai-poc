var DocumentController = /** @class */ (function () {
    function DocumentController(id, title, content, embeddings) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.embeddings = embeddings;
    }
    DocumentController.prototype.createEmbedding = function () {
        console.log('createEmbedding');
    };
    return DocumentController;
}());
var doc = new DocumentController(1, 'test', 'test', 'test');
console.log(doc.createEmbedding());
