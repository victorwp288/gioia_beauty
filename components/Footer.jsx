import Link from "next/link";

function Footer() {
  return (
    <div className="pb-10 pl-64 pr-64 text-slate-400 mt-24  md:mt-32 text-sm">
      <div className="grid md:grid-cols-3 pt-8 md:gap-0 gap-8">
        <div className="flex flex-col gap-2 md:gap-4">
          <div>
            <p>
              Lunedì, Mercoledi <b>9.00 - 19.00</b>
            </p>
            <p>
              Martedì, Giovedì <b>10.00 - 20.00</b>
            </p>
            <p>
              Venerdì <b>9.00 - 18.30</b>
            </p>
            <p>
              Sabato, Domenica <b>Chiuso</b>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:gap-4">
          <div>
            <Link
              target="_blank"
              href={"https://maps.app.goo.gl/Vg7QqpUBStAnfnzV7"}
            >
              <p>Via Emilia 60, 29010 Roveleto PC</p>
            </Link>
            <Link className="underline" href="mailto:gioiabeautyy@gmail.com">
              <p>gioiabeautyy@gmail.com</p>
            </Link>
            <Link href="tel:+393914213634">
              <p>+39 391 421 3634</p>
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/gioiabeautyy/"
            >
              <p>@gioiabeautyy</p>
            </Link>
          </div>
        </div>

        <div>
          <Link className="underline" href="/policy">
            Privacy policy
          </Link>
          <p>® 2024 Gioia Beauty</p>
          <p>
            P. IVA <b>01871820336</b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
