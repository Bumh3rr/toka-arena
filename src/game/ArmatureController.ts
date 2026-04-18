  export interface IArmatureController {
      setAnimation(name: string, bucle: number): void
      setAccesorioCabeza(index: number): void
      setAccesorioCuerpo(index: number): void
  }

  export class ArmatureController implements IArmatureController {
    private armature: any = null

    mount(armature: any, animacion: string, accesorioIndexCabeza: number, accesorioIndexCuerpo: number) {
      this.armature = armature
      armature.animation.play(animacion, 0)
      this.setAccesorioCabeza(accesorioIndexCabeza)
      this.setAccesorioCuerpo(accesorioIndexCuerpo)
    }

    applyLayout(x: number, y: number, scaleX: number, scaleY: number) {
      if (!this.armature) return
      this.armature.x = x
      this.armature.y = y
      this.armature.scaleX = scaleX
      this.armature.scaleY = scaleY
    }

    setAnimation(name: string, bucle: number) {
      this.armature?.animation.play(name, bucle)
    }

    setAccesorioCabeza(index: number) {
      this.setSlot('accesorios_cabeza', index)
    }

    setAccesorioCuerpo(index: number) {
      this.setSlot('accesorios_cuerpo', index)
    }

    private setSlot(slotName: string, index: number) {
      if (!this.armature || index === -1) return
      const slot = this.armature.armature.getSlot(slotName)
      if (slot) slot.displayIndex = index
    }
  }