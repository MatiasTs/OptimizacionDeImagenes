import fse from "fs-extra";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import imageminGifsicle from "imagemin-gifsicle";
import sharp from "sharp";

let inputFolder = "src";
let outputFolder = "opt";
let targetWidth = 1920; //esta variable la usaremos para establecer el ancho de las imagenes

const processImg = async () => {  //usamos asincronia porque si por ejemplo la primera imagen pesa más que la segunda tendría que esperar hasta que termine esta para seguir con la otra y si tenemos muchas imagenes eso puede llevar muuuuuucho tiempo. En cambio con asincronia no continua optimizando las otras mientras optimiza la primera
    try {
        const files = await fse.readdir(inputFolder); //genera una lista con todos los elementos de esa carpeta (src)

        for (const file of files){
            let inputPath = `${inputFolder}/${file}`; //generamos la ruta que se compone del nombre de la carpeta seguido de / y el nombre del archivo
            let outputPath = `${outputFolder}/${file}`;

            await sharp(inputPath).resize(targetWidth).toFile(outputPath); //redimencionamos la imagen y la mandamos a la ruta guardada en ouputPath

            await imagemin([outputPath], {
                destination: outputFolder,
                plugins: [
                    imageminJpegtran({quality: 80}), // Comprimir imagen JPG con calidad del 80%
                    imageminPngquant(), // Comprimir imagen PNG
                    imageminSvgo(), // Comprimir imagen Svg
                    imageminWebp({quality: 80}), // Comprimir imagen WebP con calidad 80%
                    imageminGifsicle(), // Comprimir imagen GIF
                ],
            });
            console.log(`Se ha optimizado correctamente la imagen ${file}`);
        }
        console.log("Ha terminado con exito el proceso de optimizar tus imágenes");
    } catch (err) {
        console.error(err);
    }
}

processImg();