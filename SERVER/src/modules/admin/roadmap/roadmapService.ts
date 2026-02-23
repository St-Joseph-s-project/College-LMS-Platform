import { STATUS_CODE } from "../../../constants/appConstants";
import { CustomError } from "../../../utils";

export const getAllRoadmapsService = async (req: any) => {
  const tenantPrisma = req.tenantPrisma;
  const roadmaps = await tenantPrisma.lms_roadmap.findMany({
    orderBy: { created_at: "desc" },
  });
  return roadmaps;
};

export const getRoadmapByIdService = async (req: any, id: number) => {
  const tenantPrisma = req.tenantPrisma;
  const roadmap = await tenantPrisma.lms_roadmap.findUnique({
    where: { id },
    include: {
      lms_roadmap_course_mapping: {
        include: {
          lms_course: true,
        },
        orderBy: {
          order_index: "asc",
        },
      },
    },
  });

  if (!roadmap) {
    throw new CustomError({
      message: "Roadmap not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  return roadmap;
};

export const createRoadmapService = async (req: any, data: any) => {
  const tenantPrisma = req.tenantPrisma;
  const roadmap = await tenantPrisma.lms_roadmap.create({
    data: {
      name: data.name,
      description: data.description,
      is_published: false,
    },
  });
  return roadmap;
};

export const updateRoadmapService = async (req: any, id: number, data: any) => {
  const tenantPrisma = req.tenantPrisma;

  const existingRoadmap = await tenantPrisma.lms_roadmap.findUnique({
    where: { id },
  });

  if (!existingRoadmap) {
    throw new CustomError({
      message: "Roadmap not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const updatedRoadmap = await tenantPrisma.lms_roadmap.update({
    where: { id },
    data: {
      name: data.name ?? existingRoadmap.name,
      description: data.description ?? existingRoadmap.description,
    },
  });

  return updatedRoadmap;
};

export const updateVisibilityService = async (req: any, id: number, is_published: boolean) => {
  const tenantPrisma = req.tenantPrisma;

  const existingRoadmap = await tenantPrisma.lms_roadmap.findUnique({
    where: { id },
  });

  if (!existingRoadmap) {
    throw new CustomError({
      message: "Roadmap not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  const updatedRoadmap = await tenantPrisma.lms_roadmap.update({
    where: { id },
    data: {
      is_published,
    },
  });

  return updatedRoadmap;
};

export const deleteRoadmapService = async (req: any, id: number) => {
  const tenantPrisma = req.tenantPrisma;

  const existingRoadmap = await tenantPrisma.lms_roadmap.findUnique({
    where: { id },
  });

  if (!existingRoadmap) {
    throw new CustomError({
      message: "Roadmap not found",
      statusCode: STATUS_CODE.NOT_FOUND,
    });
  }

  // Delete mappings first if needed, though NoAction/Cascade should be checked.
  // Given course implementation, we just delete the main entity.
  await tenantPrisma.lms_roadmap.delete({
    where: { id },
  });

  return true;
};

export const getRoadmapCoursesService = async (req: any, roadmapId: number) => {
  const tenantPrisma = req.tenantPrisma;
  const mappings = await tenantPrisma.lms_roadmap_course_mapping.findMany({
    where: { roadmap_id: roadmapId },
    include: {
      lms_course: true,
    },
    orderBy: { order_index: "asc" },
  });

  // Fetch dependencies for all courses in this roadmap
  const courseIds = mappings.map((m: any) => m.course_id);
  const dependencies = await tenantPrisma.lms_course_dependency.findMany({
    where: { course_id: { in: courseIds } },
  });

  const result = mappings.map((m: any) => ({
    ...m,
    dependencies: dependencies
      .filter((d: any) => d.course_id === m.course_id)
      .map((d: any) => d.parent_course_id),
  }));

  return result;
};

export const getAvailableCoursesDropdownService = async (req: any, roadmapId: number) => {
  const tenantPrisma = req.tenantPrisma;
  
  // Courses NOT linked to ANY roadmap
  const courses = await tenantPrisma.lms_course.findMany({
    where: {
      lms_roadmap_course_mapping: {
        none: {},
      },
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  
  return courses;
};

export const getRoadmapCoursesDropdownService = async (req: any, roadmapId: number) => {
  const tenantPrisma = req.tenantPrisma;
  
  // Courses already IN the roadmap (for dependencies)
  const mapped = await tenantPrisma.lms_roadmap_course_mapping.findMany({
    where: { roadmap_id: roadmapId },
    include: { lms_course: true },
  });
  
  return mapped.map((m: any) => ({
    id: m.lms_course.id,
    name: m.lms_course.name,
  }));
};

async function hasDependencyCycle(tenantPrisma: any, courseId: number, currentParentIds: number[]): Promise<boolean> {
  const stack = [...currentParentIds];
  const visited = new Set<number>();

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === courseId) return true;

    if (!visited.has(current)) {
      visited.add(current);
      const dependencies = await tenantPrisma.lms_course_dependency.findMany({
        where: { course_id: current },
        select: { parent_course_id: true },
      });
      stack.push(...dependencies.map((d: any) => d.parent_course_id));
    }
  }
  return false;
}

export const addCourseToRoadmapService = async (req: any, data: any) => {
  const tenantPrisma = req.tenantPrisma;
  const { roadmap_id, course_id, order_index, parent_course_ids = [] } = data;

  // Verify roadmap exists
  const roadmap = await tenantPrisma.lms_roadmap.findUnique({ where: { id: roadmap_id } });
  if (!roadmap) throw new CustomError({ message: "Roadmap not found", statusCode: STATUS_CODE.NOT_FOUND });

  // Cycle detection
  if (parent_course_ids.length > 0) {
    const cycle = await hasDependencyCycle(tenantPrisma, course_id, parent_course_ids);
    if (cycle) throw new CustomError({ message: "Circular dependency detected", statusCode: STATUS_CODE.BAD_REQUEST });
  }

  return await tenantPrisma.$transaction(async (tx: any) => {
    // Reordering logic
    if (order_index !== undefined && order_index !== null) {
      const existingMappingAtOrder = await tx.lms_roadmap_course_mapping.findFirst({
        where: { roadmap_id, order_index }
      });

      if (existingMappingAtOrder) {
        // Shift all mappings with order_index >= provided order_index
        await tx.lms_roadmap_course_mapping.updateMany({
          where: {
            roadmap_id,
            order_index: { gte: order_index }
          },
          data: { order_index: { increment: 1 } }
        });
      }
    }

    const mapping = await tx.lms_roadmap_course_mapping.create({
      data: { roadmap_id, course_id, order_index },
    });

    if (parent_course_ids.length > 0) {
      await tx.lms_course_dependency.createMany({
        data: parent_course_ids.map((pid: number) => ({
          course_id,
          parent_course_id: pid,
        })),
      });
    }

    return mapping;
  });
};

export const updateCourseMappingService = async (req: any, mappingId: number, data: any) => {
  const tenantPrisma = req.tenantPrisma;
  const { order_index, parent_course_ids } = data;

  const mapping = await tenantPrisma.lms_roadmap_course_mapping.findUnique({
    where: { id: mappingId },
  });

  if (!mapping) throw new CustomError({ message: "Mapping not found", statusCode: STATUS_CODE.NOT_FOUND });

  // Cycle detection if parents are being updated
  if (parent_course_ids !== undefined) {
    const cycle = await hasDependencyCycle(tenantPrisma, mapping.course_id, parent_course_ids);
    if (cycle) throw new CustomError({ message: "Circular dependency detected", statusCode: STATUS_CODE.BAD_REQUEST });
  }

  return await tenantPrisma.$transaction(async (tx: any) => {
    // Reordering logic
    if (order_index !== undefined && order_index !== null && order_index !== mapping.order_index) {
      const oldIndex = mapping.order_index;
      const newIndex = order_index;

      if (newIndex < oldIndex) {
        // Moving up: Increment order_index for mappings between newIndex and oldIndex - 1
        await tx.lms_roadmap_course_mapping.updateMany({
          where: {
            roadmap_id: mapping.roadmap_id,
            order_index: { gte: newIndex, lt: oldIndex }
          },
          data: { order_index: { increment: 1 } }
        });
      } else {
        // Moving down: Decrement order_index for mappings between oldIndex + 1 and newIndex
        await tx.lms_roadmap_course_mapping.updateMany({
          where: {
            roadmap_id: mapping.roadmap_id,
            order_index: { gt: oldIndex, lte: newIndex }
          },
          data: { order_index: { decrement: 1 } }
        });
      }
    }

    const updatedMapping = await tx.lms_roadmap_course_mapping.update({
      where: { id: mappingId },
      data: { order_index: order_index ?? mapping.order_index },
    });

    if (parent_course_ids !== undefined) {
      // Remove old dependencies for this course
      await tx.lms_course_dependency.deleteMany({
        where: { course_id: mapping.course_id },
      });

      // Add new ones
      if (parent_course_ids.length > 0) {
        await tx.lms_course_dependency.createMany({
          data: parent_course_ids.map((pid: number) => ({
            course_id: mapping.course_id,
            parent_course_id: pid,
          })),
        });
      }
    }

    return updatedMapping;
  });
};

export const deleteCourseMappingService = async (req: any, mappingId: number) => {
  const tenantPrisma = req.tenantPrisma;

  const mapping = await tenantPrisma.lms_roadmap_course_mapping.findUnique({
    where: { id: mappingId },
  });

  if (!mapping) throw new CustomError({ message: "Mapping not found", statusCode: STATUS_CODE.NOT_FOUND });

  return await tenantPrisma.$transaction(async (tx: any) => {
    // Shift all mappings after the deleted one down by 1
    await tx.lms_roadmap_course_mapping.updateMany({
      where: {
        roadmap_id: mapping.roadmap_id,
        order_index: { gt: mapping.order_index }
      },
      data: { order_index: { decrement: 1 } }
    });

    // We don't necessarily delete dependencies globally here, as they are course property.
    // However, if the user wanted roadmap-specific dependencies, we'd delete them.
    // For now, we only remove the mapping.
    await tx.lms_roadmap_course_mapping.delete({
      where: { id: mappingId },
    });
    return true;
  });
};
