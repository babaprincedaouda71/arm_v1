"use client";
import React from "react";
import Link from "next/link";

const index = () => {
  return (
    <>
      <header className="container mx-auto flex items-center border-b-2 px-6 py-2 h-24">
        <img src="/images/logo.png" />
        <span>Titre</span>
        <div className="grow">
          <div className="hidden flex items-center justify-center gap-2 md:gap-8">
            <input
              type="text"
              placeholder="Hello world danger"
              className="rounded-lg p-2"
            />
            <Link href="">Link 1</Link>
            <Link href="">Link 1</Link>
            <Link href="">Link 1</Link>
            <Link href="">Link 1</Link>
          </div>
        </div>
        <div className="hidden">
          <Link className="mr-2" href="">
            Sign up
          </Link>
          <Link href="">Login</Link>
        </div>
      </header>
      <aside>
        <nav>
          <ul>
            <li>Aside</li>
            <li>Aside</li>
            <li>Aside</li>
            <li>Aside</li>
          </ul>
        </nav>
      </aside>
      <main>
        <h1>Titre</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
          veritatis ullam neque aspernatur sapiente accusantium doloremque
          beatae. Dolorem pariatur quasi, ad aspernatur odio nihil beatae porro
          id ex eligendi adipisci? Maxime eos est delectus a dolores, dolorem ex
          dolore quisquam atque animi. Laudantium, nisi porro? Architecto facere
          necessitatibus eius odit, dolorem at ducimus quam ut saepe deleniti.
          Numquam, itaque quod? Ea reiciendis fugiat dolorum praesentium tenetur
          animi reprehenderit unde veniam quia molestiae sunt, similique quae,
          libero placeat nobis accusamus sed labore! Qui tenetur assumenda
          numquam, consequuntur molestias impedit ad ipsa! Rem amet illum odio
          quia aliquam, officia praesentium, incidunt doloremque pariatur hic
          excepturi quo facere ipsa nulla optio repellendus fuga velit ea,
          blanditiis iusto. Nihil impedit eveniet quae eos esse. Laudantium
          nostrum maiores, illum exercitationem soluta cupiditate esse earum
          excepturi quisquam distinctio nisi similique accusamus, aperiam beatae
          dicta. Architecto ipsam odio commodi quis similique magni aliquam ea
          minus corporis repellendus?
        </p>
      </main>
    </>
  );
};

export default index;
