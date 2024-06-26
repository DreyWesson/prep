/**
 * You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse
 * order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
 * You may assume the two numbers do not contain any leading zero, except the number 0 itself.
 *
 * Example
 * Input: l1 = [2,4,3], l2 = [5,6,4]
 * Output: [7,0,8]
 * Explanation: 342 + 465 = 807.
 *
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
class LinkedList {
    constructor(val) {
        this.head = new Node(val);
        this.tail = this.head;
        this.length = 1;
    }
    prepend(val) {
        const newNode = new Node(val);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
    }
    printList(head) {
        let node = head;
        while (node) {
            console.log("NODE ---->", node);
            console.log("Val ---->", node.val);
            node = node.next;
        }
    }
}
var addTwoNumbers = function (l1, l2) {
    let str1 = "";
    let str2 = "";
    let newVal = "";
    let tmp = 0;
    let tmp1 = 0;
    while (l1 || l2) {
        if (l1) {
            str1 += l1.val;
            l1 = l1.next;
        }
        if (l2) {
            str2 += l2.val;
            l2 = l2.next;
        }
    }

    while (str1[tmp1] || str2[tmp1]) {
        let sum = (+str1[tmp1] || 0) + (+str2[tmp1] || 0) + tmp + "";
        if (sum > 9) {
            newVal += sum[1];
            tmp = +sum[0];
        } else {
            newVal += +sum;
            tmp = 0;
        }
        tmp1++;
    }
    if (tmp) newVal += tmp;
    const newNodes = new LinkedList(newVal[newVal.length - 1]);
    let i = newVal.length - 2;
    while (i >= 0 && newVal[i]) {
        newNodes.prepend(+newVal[i]);
        i--;
    }
    return newNodes.head;
};
