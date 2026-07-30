export class Districts{

    constructor(world){

        this.world=world;

        this.size=
            world.gridSize*
            world.tileSize;

        this.map=[];

    }

    generate(){

        const h=this.size/2;

        this.map=[

            {
                name:"Residential",
                minX:-h,
                maxX:0,
                minZ:-h,
                maxZ:0
            },

            {
                name:"Commercial",
                minX:0,
                maxX:h,
                minZ:-h,
                maxZ:0
            },

            {
                name:"Industrial",
                minX:-h,
                maxX:0,
                minZ:0,
                maxZ:h
            },

            {
                name:"Downtown",
                minX:0,
                maxX:h,
                minZ:0,
                maxZ:h
            },

            {
                name:"Park",
                minX:-h*.25,
                maxX:h*.25,
                minZ:-h*.25,
                maxZ:h*.25
            }

        ];

    }

    getDistrict(x,z){

        for(const d of this.map){

            if(
                x>=d.minX&&
                x<=d.maxX&&
                z>=d.minZ&&
                z<=d.maxZ
            ){

                return d;

            }

        }

        return this.map[0];

    }

    isResidential(x,z){

        return this.getDistrict(x,z).name==="Residential";

    }

    isCommercial(x,z){

        return this.getDistrict(x,z).name==="Commercial";

    }

    isIndustrial(x,z){

        return this.getDistrict(x,z).name==="Industrial";

    }

    isDowntown(x,z){

        return this.getDistrict(x,z).name==="Downtown";

    }

    isPark(x,z){

        return this.getDistrict(x,z).name==="Park";

    }

    getRandomPosition(name){

        const d=this.map.find(
            e=>e.name===name
        );

        if(!d){

            return{
                x:0,
                z:0
            };

        }

        return{

            x:
            Math.random()*
            (d.maxX-d.minX)+
            d.minX,

            z:
            Math.random()*
            (d.maxZ-d.minZ)+
            d.minZ

        };

    }

}
