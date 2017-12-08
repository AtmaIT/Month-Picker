# Month-Picker

## Introdução:
MonthPicker é um plugin JQuery para resolver problemas de calendários do tipo mês/ano.

Demo: https://jsfiddle.net/MatheusBordin/skn1c3hu/

## Features:

1. Validações:
Valide as opções do calendário facilmente. 
*Veja como na sessão Options*.

2. Mult-Language:
Por padrão o calendário é configurado em português, mas você pode facilmente traduzir passando o Array de labels. 
*Veja como na sessão Options*.

3. Mask:
Por padrão o plugin executa uma mask no seu input, o **separator** padrão é */* mas você pode alterar utilizando as opções disponíveis.

4. Events:
Caso você precise, pode ser notificado quando o usuário mudar o valor do input (apenas com um valor válido).
*Veja como na sessão Options*.

## Options:

| Option            | Type         | Default            | Obs                    |
|-------------------|--------------|--------------------|------------------------|
|initialDate        | "mm/aaaa"    | Data atual         | Caso use um separador customizado, troque o */* por ele |
|separator          | String       | /                  | |
|icon               | String       |                    | Se prenchido, um elemento `<i></i>` sera inserido dentro do input, o valor desta proprieda sera sua classe. |
|monthLabels        | Array<String>| ["Janeiro",...]    | |
|containerClass     | String       |                    | A classe sera aplicada no container do calendário |
|minYear            | Number       |                    | Se passado, este será o menor ano disponível para o usuário selecionar |
|minMonth           | Number       |                    | Se passado, este será o menor mês disponível para o usuário no ano mínimo |
|maxYear            | Number       |                    | Se passado, este será o ultimo ano disponível para o usuário selecionar |
|maxMonth           | Number       |                    | Se passado, este será o ultimo mês disponível para o usuário no ano maximo |

## Exemplo:

```javascript
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

$(".month-picker").monthPicker({
    icon: 'fa fa-calendar',
    minYear: currentYear,
    minMonth: currentMonth,
    maxYear: currentYear + 10,
    initialDate: currentMonth + '/' + currentYear,
    onChange: function(month, year) {
        console.log(`${month}/${year}`);
    }
});
```

## Contribuidores:

* Matheus Bordin