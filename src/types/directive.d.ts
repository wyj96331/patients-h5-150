import { DirectiveBinding } from 'vue'

interface CustomModelDirective {
  mounted(el: HTMLInputElement, binding: DirectiveBinding<any>, vnode: any): void
  updated(el: HTMLInputElement, binding: DirectiveBinding<any>, vnode: any): void
}

export default CustomModelDirective
