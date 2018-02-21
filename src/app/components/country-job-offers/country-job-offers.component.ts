import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-country-job-offers',
  templateUrl: './country-job-offers.component.html',
  styleUrls: ['./country-job-offers.component.scss']
})
export class CountryJobOffersComponent implements OnInit {

  public chartData = [
    ['Województwo', 'Ofert Pracy'],
    ['Dolnośląskie', 1],
    ['Lubelskie', 1],
    ['Łódzkie', 2],
    ['Małopolskie', 0],
    ['Opolskie', 23],
    ['Podkarpackie', 11],
    ['Mazowieckie', 6],
    ['Podlaskie', 9],
    ['Pomorskie', 11],
    ['Śląskie', 15],
    ['Świętokrzyskie', 8],
    ['Warmińsko-mazurskie', 50],
    ['Wielkopolskie', 0],
    ['Zachodniopomorskie', 2],
    ['Kujawsko-pomorskie', 0],
    ['Lubuskie', 0],
  ];
  public optionsXSSmall = CountryJobOffersComponent.setOptions(200);
  public optionsSmall = CountryJobOffersComponent.setOptions(325);
  public optionsMedium = CountryJobOffersComponent.setOptions(380);
  public optionsBig = CountryJobOffersComponent.setOptions();
  public text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque possimus, quidem! Ad at corporis dolore
          facere laborum libero magnam optio quas quidem quod repellat, sapiente sed vero vitae voluptatem. Culpa cum
          delectus dolor ea expedita, explicabo, id mollitia neque nesciunt obcaecati officiis perferendis porro
          reprehenderit suscipit temporibus ut voluptatem. Dolore, dolorem eveniet inventore laborum modi nam quis
          reprehenderit sequi! Aspernatur id natus tempora veniam veritatis! Cum dolore et expedita fugit, ipsa iure
          neque non perferendis placeat, sequi tenetur ut voluptate? A consequuntur dolore eius enim et harum hic,
          itaque minima mollitia nesciunt obcaecati qui repellat sapiente sunt tempore ut voluptatem. Assumenda beatae,
          commodi cumque cupiditate deserunt dolor ea earum eius enim eum facere hic illum inventore ipsum labore,
          laborum magnam maiores modi natus nihil numquam obcaecati praesentium quae quaerat quam quis reiciendis rem
          repellat reprehenderit sequi tempore vel voluptate voluptatem. Aut delectus fuga quis repudiandae tempora.
          Eaque error esse exercitationem expedita odit quam vitae voluptatibus. Ab aliquid assumenda cum odit quasi,
          quidem repellat vel veniam. Alias aliquam, culpa iure iusto, minus molestias neque nesciunt optio quaerat
          quibusdam recusandae, repudiandae. Amet assumenda autem, consequatur error nam natus quo. Adipisci asperiores
          atque eius illum rem. Amet asperiores beatae delectus deleniti deserunt dolor dolore doloremque dolores eius
          fugiat incidunt iste magnam nemo odio officiis pariatur quas quasi, quis reiciendis repellat rerum saepe
          sapiente similique sit temporibus totam vel veniam. Aliquam exercitationem nobis recusandae sit suscipit,
          voluptas. At beatae dolore eius fugiat molestiae officia, repudiandae velit. Accusantium aliquam, cum dolores
          et eum explicabo fugiat maiores nihil odit quidem quisquam sapiente sit! A amet asperiores assumenda
          consequuntur culpa cum, cupiditate dicta dolor dolore expedita facere fuga id illum impedit inventore ipsum
          maiores minus modi natus nulla possimus praesentium, quae quam quibusdam quidem quis quo ratione similique
          sint temporibus tenetur ut vitae voluptatibus! Aspernatur, ea, iusto!`;

  static setOptions(height = 480) {
    return {
      region: 'PL',
      displayMode: 'regions',
      resolution: 'provinces',
      // width: 640,
      height,
      datalessRegionColor: '#9b9b9b',
      colorAxis: {
        colors: ['#666666', '#25e051', '#d9ff5e', '#ff7525', '#cc151d']
      },
      tooltip: { textStyle: { color: '#FF0000' }, showColorCode: true },
    };
  }

  constructor() {
  }

  ngOnInit() {
  }

  turnCate(str, length) {
    return str.length > length ? `${str.slice(0, length)}...` : str;
  }

}

// PL-LB	Lubuskie	Lubusz
// PL-LD	Łódzkie	Łódź
// PL-MA	Małopolskie	Lesser Poland
// PL-MZ	Mazowieckie	Mazovia
// PL-OP	Opolskie	Opole (Upper Silesia)
// PL-PK	Podkarpackie	Subcarpathia
// PL-PD	Podlaskie	Podlaskie
// PL-PM	Pomorskie	Pomerania
// PL-SL	Śląskie	Silesia
// PL-SK	Świętokrzyskie	Holy Cross
// PL-WN	Warmińsko-mazurskie	Warmia-Masuria
// PL-WP	Wielkopolskie	Greater Poland
// PL-ZP	Zachodniopomorskie	West Pomerania
