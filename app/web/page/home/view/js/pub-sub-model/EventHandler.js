import Subject from './Subject';
import Publish from './Publish';
class EventHandler { // 调度中心
    constructor() {
        this.subList = [];
        this.pubList = [];
    }
    addSub(sub) {
        this.subList.push(sub);
    }
    addPub(pub) {
        this.pubList.push(pub);
    }
}




const eventHandler = new EventHandler();
eventHandler.addSub(new Subject(
    {
        theme: 'new-product',
        cb: (news) => {
            console.log(news);
        }
    }
));
const pub = new Publish();
eventHandler.addPub(pub.pub.bind(this));
pub.publish('new-product');
