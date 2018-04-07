export {};

const toString: () => string = Object.prototype.toString;
const hasOwnProperty: (v: string) => boolean = Object.prototype.hasOwnProperty;

interface SomeObject {
  [key: string]: any;
}

interface extendInterface {
  (first: boolean | object, ...sources: SomeObject[]) : object ;
}

interface isPlainObjectInterface {
  (value: any): boolean;
}
/**
 * Проверяет, что переданный объект является "плоским" (т.е. созданным с помощью "{}"
 * или "new Object").
 *
 * @param {Object} obj
 * @returns {Boolean}
 */

const isPlainObject: isPlainObjectInterface = (obj) => {
  if (toString.call(obj) !== '[object Object]') {
    return false;
  }
  
  const prototype: null | ObjectConstructor = Object.getPrototypeOf(obj);
  return prototype === null ||
        prototype === Object.prototype;
};

/**
 * Копирует перечислимые свойства одного или нескольких объектов в целевой объект.
 *
 * @param {Boolean} [deep=false] При значении `true` свойства копируются рекурсивно.
 * @param {Object} target Объект для расширения. Он получит новые свойства.
 * @param {...Object} objects Объекты со свойствами для копирования. Аргументы со значениями
 *      `null` или `undefined` игнорируются.
 * @returns {Object}
 */
const extend: extendInterface = function extend(first, ...sources) {
  let target: SomeObject;
  let deep: boolean;
  let i: number;

    // Обрабатываем ситуацию глубокого копирования.
  if (typeof first === 'boolean') {
    deep = first;
    target = sources[0];
    i = 1;
  } else {
    deep = false;
    i = 0;
    target = first;
  }

  for (; i < sources.length; i += 1) {
    const obj = sources[i];
    if (!obj) {
      continue;
    }

    for (const key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        const val: object[] | object = obj[key];
        const isArray = val && Array.isArray(val);

                // Копируем "плоские" объекты и массивы рекурсивно.
        if (deep && val && (isPlainObject(val) || isArray)) {
          const src: object | object[] = target[key];
          let clone: object | object[];
          if (isArray) {
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          target[key] = extend(deep, clone, val);
        } else {
          target[key] = val;
        }
      }
    }
  }

  return target;
};

const obj1 = {};
console.log('#1.BEFORE:', {});
const obj2 = { foo: { bar: true }, arr: [1, 2] };
const obj3 = { foo: { baz: true }, arr: [1, 3, 4] };

extend(true, obj1, obj2, obj3, null);

console.log('#1.AFTER:', obj1);
console.log('#2:', obj2);
console.log('#3:', obj3);
