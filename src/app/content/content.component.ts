import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {BinarySearchTree} from '../bst/BinarySearchTree';
import {TreeNode} from '../bst/TreeNode';
import {style} from '@angular/animations';

interface PointStyles {
    fillStyle: string;
    lineWidth: number;
    strokeStyle: string;
}

interface Point {
    index: number;
    value2: number;
    radius: number;
    x: number;
    y: number;
    styles: PointStyles;
}

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.css']
})
export class ContentComponent implements AfterViewInit {

    @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
    private context!: CanvasRenderingContext2D | null;

    tree: BinarySearchTree<number, string>;
    nodes: TreeNode<number, string>[] = [];
    parentsIndexes: number[] = [];
    treeHeight = 0;

    private isClick = false;
    private xShift = 0;
    private yShift = 0;
    private scale = 0.8;

    private inputValue = 0;

    private colors: string[] = [];

    result = '';

    private palette = [
        '#ffcdb2',
        '#ff8882',
        '#96d1cd',
        '#b1a9d4',
        '#74c3e1',
        '#ffafa4',
    ];

    constructor() {
        this.tree = new BinarySearchTree();
        for (let i = 0; i < 6; i++) {
            const key = Math.floor(1000 * Math.random());
            const value = 'leaf_' + i;
            this.tree.insert(key, value);
        }

        this.treeHeight = this.tree.getHeight();
        console.log('height: ' + this.treeHeight);

        this.getNodesArrayRecursive(this.tree.getRoot());
        console.log('\nnodes:');
        console.log(this.nodes);

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            for (let j = 0; j < this.nodes.length; j++) {
                if (this.nodes[j].right === node || this.nodes[j].left === node) {
                    this.parentsIndexes[i] = j;
                    break;
                }
            }
        }
        console.log('\nparents:');
        console.log(this.parentsIndexes);

        this.createTreeData(this.treeHeight);
        this.bind();
        this.scale = 0.8;
    }

    private getNodesArrayRecursive(node: TreeNode<any, any> | null): void {
        if (node == null) {
            return;
        } else {
            this.getNodesArrayRecursive(node.left);
            this.nodes.push(node);
            this.getNodesArrayRecursive(node.right);
        }
    }

    private drawInit(): void {
        this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
        const rect = (this.canvas.nativeElement as HTMLCanvasElement).getBoundingClientRect();
        if (this.context != null) {
            this.context.canvas.width = rect.width;
            this.context.canvas.height = rect.height;
            this.draw(this.context);
            this.drawArrows(this.context);
        }
    }

    ngAfterViewInit(): void {
        this.drawInit();
    }

    onZoom($event: any): void {
        const s = Math.sign($event.wheelDelta);
        const z = 0.05;
        if (s < 0) {
            if (this.scale > 0.2) {
                this.scale -= z;
            }
        } else {
            if (this.scale < 2.0) {
                this.scale += z;
            }
        }
        this.drawInit();
    }

    onTranslate($event: MouseEvent): void {
        if (this.isClick) {
            this.xShift += $event.movementX;
            this.yShift += $event.movementY;
            this.drawInit();
        }
    }

    onCanvasResize(): void {
        this.drawInit();
    }

    onMouseDown(): void {
        this.isClick = true;
    }

    onMouseUp(): void {
        this.isClick = false;
    }

    onMouseLeave(): void {
        this.isClick = false;
    }

    // TODO: FIX THIS SHIT ///////////////////////////////////////////////////////////////////

    // tslint:disable-next-line:member-ordering
    points: Point[] = [];

    // tslint:disable-next-line:member-ordering
    private centerY = 0;

    // tslint:disable-next-line:member-ordering
    value: number | null = null;

    // tslint:disable-next-line:member-ordering
    private static getRandomColor(): PointStyles {
        const palette = [
            '#ffcdb2',
            '#ff8882',
            '#96d1cd',
            '#b1a9d4',
            '#74c3e1',
            '#ffafa4',
        ];
        return {
            fillStyle: palette[Math.floor(palette.length * Math.random())],
            lineWidth: 8,
            strokeStyle: '#45597e'
        };
    }

    // tslint:disable-next-line:member-ordering
    private static generateRandomData(): number[] {
        const data: number[] = [];
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(64 * Math.random() + 1);
            data.push(x);
        }
        return data;
    }

    private draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(ctx.canvas.width / 2 + this.xShift, this.centerY / 2 + this.yShift);
        ctx.scale(this.scale, this.scale);
        for (const p of this.points) {
            if (p.value2 === 0) {
                continue;
            }
            ctx.fillStyle = p.styles.fillStyle;
            ctx.lineWidth = p.styles.lineWidth;
            ctx.strokeStyle = p.styles.strokeStyle;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#000000';
            ctx.font = p.radius + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(p.value2), p.x, p.y + 2);
        }
        ctx.restore();
    }

    private drawArrows(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(ctx.canvas.width / 2 + this.xShift, this.centerY / 2 + this.yShift);
        ctx.scale(this.scale, this.scale);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#45597e';
        for (const p of this.points) {
            if (p.value2 === 0) {
                continue;
            }
            if (p.index !== 1) {
                const parentId = Math.floor(p.index / 2);
                let parent = this.points[0];
                for (const point of this.points) {
                    if (point.index === parentId) {
                        parent = point;
                        break;
                    }
                }
                let x = p.x - parent.x;
                let y = p.y - parent.y;
                const r = Math.sqrt(x * x + y * y);
                x /= r;
                y /= r;
                ctx.beginPath();
                ctx.setLineDash([16, 16]);
                ctx.moveTo(parent.x + 60 * x, parent.y + 60 * y);
                ctx.lineTo(p.x - 60 * x, p.y - 60 * y);
                ctx.stroke();
            }
        }
        ctx.restore();
    }

    private getCenter(): [number, number] {
        let cx = 0;
        let cy = 0;
        let n = 0;
        for (const p of this.points) {
            if (p.value2 !== 0) {
                cx += p.x;
                cy += p.y;
                n++;
            }
        }
        cx /= n;
        cy /= n;
        return [cx, cy];
    }

    private createTreeData(height: number): void {
        const radius = 64;
        const layers = height;
        const minDistance = 8;
        const verticalGap = 1;

        for (let i = 0; i < layers; i++) {
            const n = Math.pow(2, i);
            const y = (2 + verticalGap) * radius * i;
            for (let j = 0; j < n / 2; j++) {
                const a = (radius + minDistance) * Math.pow(2, (layers - i - 1));
                const x: number = a + 2 * a * j;
                this.centerY = y;
                if (i === 0) {
                    const c = this.palette[j % this.palette.length];
                    this.colors.push(c);
                    const styles = ContentComponent.getRandomColor();
                    styles.fillStyle = c;
                    this.points.push({index: 1, value2: 0, radius, x: 0, y: 0, styles});
                } else {
                    const pointsInRow = Math.pow(2, i);
                    const pointsInRowByTwo = pointsInRow / 2;
                    const c1 = this.palette[j % this.palette.length];
                    this.colors.push(c1);
                    const styles1 = ContentComponent.getRandomColor();
                    styles1.fillStyle = c1;
                    this.points.push({index: pointsInRow + j + pointsInRowByTwo, value2: 0, radius, x, y, styles: styles1});
                    const c2 = this.palette[j % this.palette.length];
                    this.colors.push(c2);
                    const styles2 = ContentComponent.getRandomColor();
                    styles2.fillStyle = c2;
                    this.points.push({index: pointsInRow - j + pointsInRowByTwo - 1, value2: 0, radius, x: -x, y, styles: styles2});
                }
            }
        }
    }

    private bind(): void {
        if (this.tree.getRoot() != null) {
            // @ts-ignore
            this.points[0].value2 = this.tree.getRoot().key;
        }
        for (const p of this.points) {
            const trace = [];
            let id = p.index;
            while (id !== 1) {
                trace.push(id);
                id = Math.floor(id / 2);
            }
            trace.reverse();
            // console.log(trace);
            let nodePointer = this.tree.getRoot();
            for (const t of trace) {
                // right
                if (t % 2 !== 0) {
                    if (nodePointer?.right != null) {
                        nodePointer = nodePointer?.right;
                        p.value2 = nodePointer.key;
                    } else {
                        p.value2 = 0;
                        break;
                    }
                }
                // left
                else {
                    if (nodePointer?.left != null) {
                        nodePointer = nodePointer?.left;
                        p.value2 = nodePointer.key;
                    } else {
                        // p.styles = {fillStyle: '#00000000', lineWidth: 0, strokeStyle: '#00000000'};
                        p.value2 = 0;
                        break;
                    }
                }
            }
        }
    }

    private drawScene(): void {
        if (this.canvas != null) {
            this.context = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');
            const rect = (this.canvas.nativeElement as HTMLCanvasElement).getBoundingClientRect();
            const ctx = this.context;
            if (ctx != null) {
                ctx.canvas.width = 2 * rect.width;
                ctx.canvas.height = 2 * rect.height;
                this.draw(ctx);
                this.drawArrows(ctx);
            }
        }
    }

    private getHeight(node: TreeNode<number, number> | null): number {
        if (node != null) {
            return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
        } else {
            return 0;
        }
    }

    onInput(innerHTML: string): void {
        this.inputValue = +innerHTML;
    }

    addNode($event: any): void {
        this.result = 'Added a new node';
        this.tree.insert(this.inputValue, $event.toString());
        this.treeHeight = this.tree.getHeight();
        this.points = [];
        this.createTreeData(this.treeHeight);
        this.bind();
        this.drawInit();
    }

    findNode(): void {
        const res = this.tree.find(this.inputValue);
        if (res != null) {
            this.result = '{key: ' + res.key + ', value: ' + res.value + '}';
        } else {
            this.result = 'The node doesn\'t exist';
        }
    }

    removeNode(): void {
        this.result = 'Deleted node';
        this.tree.remove(this.inputValue);
        this.treeHeight = this.tree.getHeight();
        this.points = [];
        this.createTreeData(this.treeHeight);
        this.bind();
        this.drawInit();
    }
}
